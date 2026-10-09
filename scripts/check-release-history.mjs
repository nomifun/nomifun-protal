import assert from "node:assert/strict";
import {
  fetchReleaseHistory,
  fetchGitHubHistory,
} from "../lib/release-history.mjs";
import { RELEASE_SOURCES, normalizeGitHubRelease } from "../lib/downloads.mjs";

const listUrl =
  "https://api.github.com/repos/nomifun/nomifun-desktop/releases?per_page=30&page=1";
const htmlUrl = "https://github.com/nomifun/nomifun-desktop/releases";
const githubRelease = (version, names, date = "2026-10-09T00:00:00Z") => ({
  tag_name: `v${version}`,
  published_at: date,
  draft: false,
  prerelease: false,
  assets: names.map((name, index) => ({
    id: index + 1,
    name,
    browser_download_url: `https://github.com/nomifun/nomifun-desktop/releases/download/v${version}/${name}`,
    size: 4096,
  })),
});
const latestMac = githubRelease(
  "1.2.4",
  ["NomiFun_1.2.4_aarch64.dmg"],
  "2026-10-09T02:00:00Z",
);
const oldWindows = githubRelease(
  "1.2.3",
  ["NomiFun_1.2.3_x64-setup.exe", "NomiFun_1.2.3_arm64.msi"],
  "2026-10-08T02:00:00Z",
);
const oldLinux = githubRelease(
  "1.2.2",
  ["NomiFun_1.2.2_amd64.deb"],
  "2026-10-07T02:00:00Z",
);
const packageFor = (catalog, platform) =>
  catalog.assets.find((asset) => asset.platform === platform);
const ghFetch = (history) => async (url) => {
  if (url === RELEASE_SOURCES.github.metadataUrl)
    return Response.json(latestMac);
  assert.equal(url, listUrl);
  return Response.json(history);
};

const catalog = await fetchReleaseHistory("github", {
  fetchImpl: ghFetch([latestMac, oldWindows, oldLinux]),
});
assert.equal(catalog.version, "1.2.4");
assert.equal(packageFor(catalog, "macos").version, "1.2.4");
assert.equal(packageFor(catalog, "windows").version, "1.2.3");
assert.equal(packageFor(catalog, "linux").version, "1.2.2");
assert.match(packageFor(catalog, "windows").url, /\/v1\.2\.3\//);
assert.equal(
  packageFor(catalog, "windows").publishedAt,
  "2026-10-08T02:00:00.000Z",
);
assert.equal(catalog.historyComplete, true);
assert.equal(catalog.partial, false);
assert.equal(packageFor(catalog, "windows").retained, false);
assert.equal(catalog.latestResolved, true);

const officialRollback = await fetchReleaseHistory("github", {
  fetchImpl: async (url) =>
    Response.json(
      url === RELEASE_SOURCES.github.metadataUrl
        ? oldWindows
        : [latestMac, oldWindows],
    ),
});
assert.equal(
  officialRollback.version,
  "1.2.3",
  "the source's explicit latest selection wins over history order",
);
assert.equal(officialRollback.latestResolved, true);

const historyOnly = await fetchReleaseHistory("github", {
  fetchImpl: async (url) =>
    url === listUrl
      ? Response.json([oldWindows, latestMac, oldLinux])
      : new Response("unavailable", { status: 503 }),
});
assert.equal(
  historyOnly.version,
  "1.2.4",
  "a history-only result derives the newest verified envelope",
);
assert.equal(historyOnly.latestResolved, false);
assert.equal(historyOnly.partial, true);

const secondPageFailure = await fetchReleaseHistory("github", {
  fetchImpl: async (url) => {
    if (url === RELEASE_SOURCES.github.metadataUrl)
      return Response.json(latestMac);
    if (url === listUrl)
      return Response.json(
        Array.from({ length: 30 }, (_value, index) => ({
          ...oldWindows,
          tag_name: `v1.1.${index}`,
        })),
      );
    assert.match(url, /page=2$/);
    return new Response("upstream unavailable", { status: 503 });
  },
});
assert.equal(secondPageFailure.version, "1.2.4");
assert.equal(secondPageFailure.historyComplete, false);
assert.equal(secondPageFailure.partial, true);
assert.ok(packageFor(secondPageFailure, "windows"));

const section = (release, extra = "") =>
  `<section data-release-anchor="release-${release.tag_name}"><relative-time datetime="${release.published_at}"></relative-time>${extra}</section>`;
const fallbackCalls = [];
const htmlFallback = await fetchReleaseHistory("github", {
  fetchImpl: async (url) => {
    fallbackCalls.push(url);
    if (url === RELEASE_SOURCES.github.metadataUrl)
      return Response.json(latestMac);
    if (url === listUrl) return new Response("rate limited", { status: 429 });
    if (url === htmlUrl)
      return new Response(
        `${section(latestMac)}${section({ ...oldLinux, tag_name: "v9.0.0-beta" }, '<span class="Label Label--warning">Pre-release</span>')}<a href="/nomifun/nomifun-desktop/releases?page=2" rel="next">next</a>`,
      );
    if (url === `${htmlUrl}?page=2`)
      return new Response(section(oldWindows) + section(oldLinux));
    const release = [latestMac, oldWindows, oldLinux].find((item) =>
      url.endsWith(`/expanded_assets/${item.tag_name}`),
    );
    assert.ok(release, url);
    return new Response(
      release.assets
        .map(
          (asset) =>
            `<a href="${new URL(asset.browser_download_url).pathname}">installer</a>`,
        )
        .join(""),
    );
  },
});
assert.equal(htmlFallback.historyComplete, true);
assert.equal(htmlFallback.partial, false);
assert.equal(packageFor(htmlFallback, "windows").version, "1.2.3");
assert.equal(packageFor(htmlFallback, "linux").version, "1.2.2");
assert.ok(
  !fallbackCalls.some((url) => url.includes("9.0.0-beta")),
  "prerelease fragments must never be fetched",
);

const prereleaseFirstPage = await fetchGitHubHistory({
  fetchImpl: async (url) => {
    if (url === listUrl) return new Response("rate limited", { status: 403 });
    if (url === htmlUrl)
      return new Response(
        `${section({ ...oldLinux, tag_name: "v9.0.0-beta" }, '<span class="Label">Pre-release</span>')}<a href="/nomifun/nomifun-desktop/releases?page=2" rel="next">next</a>`,
      );
    if (url === `${htmlUrl}?page=2`) return new Response(section(oldWindows));
    return new Response(
      oldWindows.assets
        .map(
          (asset) =>
            `<a href="${new URL(asset.browser_download_url).pathname}">installer</a>`,
        )
        .join(""),
    );
  },
});
assert.equal(prereleaseFirstPage.releases[0].version, "1.2.3");
assert.equal(
  prereleaseFirstPage.partial,
  false,
  "a page containing only prereleases still advances to the next stable release page",
);

const allHistoryFailure = await fetchReleaseHistory("github", {
  fetchImpl: async (url) => {
    if (url === RELEASE_SOURCES.github.metadataUrl)
      return Response.json(latestMac);
    return new Response("unavailable", { status: 503 });
  },
});
assert.equal(
  allHistoryFailure.version,
  "1.2.4",
  "valid latest metadata survives history failure",
);
assert.equal(allHistoryFailure.partial, true);
assert.equal(allHistoryFailure.assets.length, 1);

const partialAssets = await fetchReleaseHistory("github", {
  fetchImpl: async (url) => {
    if (url === RELEASE_SOURCES.github.metadataUrl)
      return Response.json(latestMac);
    if (url === listUrl) return new Response("rate limited", { status: 403 });
    if (url === htmlUrl)
      return new Response(section(oldWindows) + section(oldLinux));
    if (url.endsWith("v1.2.3"))
      return new Response(
        oldWindows.assets
          .map(
            (asset) =>
              `<a href="${new URL(asset.browser_download_url).pathname}">installer</a>`,
          )
          .join(""),
      );
    return new Response("unavailable", { status: 503 });
  },
});
assert.equal(partialAssets.partial, true);
assert.equal(partialAssets.historyComplete, false);
assert.ok(packageFor(partialAssets, "windows"));

await assert.rejects(
  fetchReleaseHistory("github", {
    fetchImpl: async (url) => {
      if (url.includes("api.github.com"))
        return Response.json({ malformed: true });
      return new Response("not a release page");
    },
  }),
  /publish date|no readable|release tag/,
);

let pages = 0;
const bounded = await fetchGitHubHistory({
  fetchImpl: async (url) => {
    pages += 1;
    return Response.json(
      Array.from({ length: 30 }, (_value, index) =>
        githubRelease(`0.${pages}.${index}`, []),
      ),
    );
  },
});
assert.equal(pages, 2);
assert.equal(bounded.releases.length, 40);
assert.equal(bounded.partial, true);
assert.equal(bounded.historyComplete, false);

const exactBound = await fetchGitHubHistory({
  fetchImpl: async (url) => {
    const page = Number(new URL(url).searchParams.get("page"));
    return Response.json(
      Array.from({ length: page === 1 ? 30 : 10 }, (_value, index) =>
        githubRelease(`0.${page}.${index}`, []),
      ),
    );
  },
});
assert.equal(exactBound.releases.length, 40);
assert.equal(exactBound.historyComplete, true);
assert.equal(
  exactBound.partial,
  false,
  "exactly reaching the bound without further pages does not fabricate a scan failure",
);

const timedPartial = await fetchReleaseHistory("github", {
  timeoutMs: 25,
  fetchImpl: async (url, { signal }) => {
    if (url === RELEASE_SOURCES.github.metadataUrl)
      return Response.json(latestMac);
    if (url === listUrl)
      return Response.json(
        Array.from({ length: 30 }, (_value, index) => ({
          ...oldWindows,
          tag_name: `v1.1.${index}`,
        })),
      );
    return new Promise((_resolve, reject) =>
      signal.addEventListener("abort", () => reject(new Error("deadline")), {
        once: true,
      }),
    );
  },
});
assert.equal(timedPartial.partial, true);
assert.equal(timedPartial.version, "1.2.4");
assert.ok(packageFor(timedPartial, "windows"));

const cnRelease = (
  version,
  names,
  date = "2026-10-09T00:00:00Z",
  extra = {},
) => ({
  result: {
    type: "response",
    data: {
      version,
      status: "Published",
      channel: null,
      pubDate: date,
      assets: names.map((assetFilename, index) => ({
        assetId: `01M4FP67BB5JAMFXNWP3JCY0K${index}`,
        assetFilename,
        assetSize: 4096,
      })),
      ...extra,
    },
  },
});
const readCnVersion = (url) =>
  JSON.parse(new URL(url).searchParams.get("input")).version;
const cnLatest = cnRelease(
  "3.0.1",
  ["NomiFun_3.0.1_aarch64.dmg"],
  "2026-10-09T03:00:00Z",
);
const cnWindows = cnRelease(
  "2.9.0",
  ["NomiFun_2.9.0_x64-setup.exe"],
  "2026-10-08T03:00:00Z",
);
const nullCn = { result: { type: "response", data: null } };
const cnQueried = [];
const independent = await fetchReleaseHistory("crabnebula", {
  candidateVersions: ["2.9.0", "2.8.0"],
  fetchImpl: async (url) => {
    if (url.includes("api.github.com"))
      return Response.json([githubRelease("5.0.0", [])]);
    const version = readCnVersion(url);
    cnQueried.push(version);
    return Response.json(
      version === null ? cnLatest : version === "2.9.0" ? cnWindows : nullCn,
    );
  },
});
assert.equal(
  independent.version,
  "3.0.1",
  "GitHub version never becomes CrabNebula version",
);
assert.equal(packageFor(independent, "windows").version, "2.9.0");
assert.equal(independent.historyComplete, false);
assert.equal(
  independent.partial,
  false,
  "an absent candidate is not a refresh failure",
);
assert.deepEqual(independent.knownVersions.sort(), ["2.9.0", "3.0.1"]);
assert.ok(
  cnQueried.includes("5.0.0"),
  "GitHub tags are hints for CrabNebula's own public lookup",
);

const seed = {
  version: "2.9.0",
  knownVersions: ["2.9.0"],
  assets: [
    {
      ...normalizeGitHubRelease(oldWindows).assets[0],
      version: "2.9.0",
      checkedAt: "2026-01-01T00:00:00.000Z",
    },
  ],
};
const originalSeed = structuredClone(seed);
const cnWithoutGithub = await fetchReleaseHistory("crabnebula", {
  seed,
  fetchImpl: async (url) => {
    if (url.includes("github.com"))
      return new Response("unavailable", { status: 503 });
    return Response.json(readCnVersion(url) === null ? cnLatest : cnWindows);
  },
});
assert.equal(cnWithoutGithub.version, "3.0.1");
assert.ok(
  packageFor(cnWithoutGithub, "windows"),
  "GitHub failure does not prevent seed candidate lookup",
);
assert.equal(cnWithoutGithub.partial, true);
assert.deepEqual(
  seed,
  originalSeed,
  "discovery never updates a seed's old check time",
);

const mismatch = await fetchReleaseHistory("crabnebula", {
  candidateVersions: ["2.9.0", "2.8.0", "2.7.0"],
  fetchImpl: async (url) => {
    if (url.includes("api.github.com")) return Response.json([]);
    const version = readCnVersion(url);
    return Response.json(
      version === null
        ? cnLatest
        : version === "2.9.0"
          ? cnRelease("99.0.0", ["NomiFun_99.0.0_x64-setup.exe"])
          : version === "2.8.0"
            ? cnRelease("2.8.0", ["NomiFun_2.8.0_x64-setup.exe"], undefined, {
                channel: "beta",
              })
            : cnRelease("2.7.0", [], undefined, { status: "Draft" }),
    );
  },
});
assert.equal(mismatch.assets.length, 1);
assert.equal(
  mismatch.partial,
  true,
  "mismatched response is a failed query rather than a trusted installer",
);

const prereleaseSkipped = await fetchReleaseHistory("crabnebula", {
  candidateVersions: ["2.8.0"],
  fetchImpl: async (url) => {
    if (url.includes("api.github.com")) return Response.json([]);
    return Response.json(
      readCnVersion(url) === null
        ? cnLatest
        : cnRelease("2.8.0", [], undefined, { channel: "beta" }),
    );
  },
});
assert.equal(prereleaseSkipped.partial, false);

const malformedHistory = await fetchReleaseHistory("crabnebula", {
  candidateVersions: ["2.8.0"],
  fetchImpl: async (url) => {
    if (url.includes("api.github.com")) return Response.json([]);
    return Response.json(
      readCnVersion(url) === null
        ? cnLatest
        : { result: { type: "response", data: {} } },
    );
  },
});
assert.equal(
  malformedHistory.partial,
  true,
  "malformed history is a failed check rather than a missing version",
);
assert.equal(malformedHistory.version, "3.0.1");

let queries = 0;
let concurrent = 0;
let maxConcurrent = 0;
const boundedCn = await fetchReleaseHistory("crabnebula", {
  candidateVersions: Array.from(
    { length: 30 },
    (_value, index) => `2.0.${index}`,
  ),
  fetchImpl: async (url) => {
    concurrent += 1;
    maxConcurrent = Math.max(maxConcurrent, concurrent);
    await new Promise((resolve) => setTimeout(resolve, 2));
    concurrent -= 1;
    if (url.includes("api.github.com")) return Response.json([]);
    const version = readCnVersion(url);
    if (version !== null) queries += 1;
    return Response.json(version === null ? cnLatest : nullCn);
  },
});
assert.equal(queries, 20);
assert.ok(maxConcurrent <= 4);
assert.equal(boundedCn.partial, true);

const crowdedCandidates = [];
const oldKnown = Array.from({ length: 200 }, (_value, index) => `0.1.${index}`);
const newlyDiscovered = await fetchReleaseHistory("crabnebula", {
  candidateVersions: oldKnown,
  seed: { ...seed, knownVersions: oldKnown },
  fetchImpl: async (url) => {
    if (url.includes("api.github.com"))
      return Response.json([
        githubRelease("0.1.0", [], "2025-01-01T00:00:00Z"),
        githubRelease("4.0.0", [], "2026-10-08T04:00:00Z"),
      ]);
    const version = readCnVersion(url);
    crowdedCandidates.push(version);
    return Response.json(
      version === null
        ? cnLatest
        : version === "4.0.0"
          ? cnRelease(
              "4.0.0",
              ["NomiFun_4.0.0_x64-setup.exe"],
              "2026-10-08T04:00:00Z",
            )
          : nullCn,
    );
  },
});
assert.ok(
  crowdedCandidates.includes("4.0.0"),
  "an accumulated old version index cannot starve newly discovered historical releases",
);
assert.ok(
  crowdedCandidates.indexOf("4.0.0") < crowdedCandidates.indexOf("0.1.1"),
);
assert.equal(packageFor(newlyDiscovered, "windows").version, "4.0.0");

await assert.rejects(
  fetchReleaseHistory("crabnebula", {
    seed,
    fetchImpl: async (url) => {
      if (url.includes("api.github.com")) return Response.json([oldWindows]);
      return readCnVersion(url) === null
        ? new Response("unavailable", { status: 503 })
        : Response.json(cnWindows);
    },
  }),
  /HTTP 503/,
);
await assert.rejects(
  fetchReleaseHistory("crabnebula", {
    fetchImpl: async (url) =>
      url.includes("github.com")
        ? Response.json([])
        : Response.json({ result: { type: "response", data: {} } }),
  }),
  /valid published/,
);
await assert.rejects(
  fetchReleaseHistory("crabnebula", {
    timeoutMs: 10,
    fetchImpl: async (url, { signal }) => {
      if (url.includes("github.com")) return Response.json([]);
      return new Promise((_resolve, reject) =>
        signal.addEventListener("abort", () => reject(new Error("deadline")), {
          once: true,
        }),
      );
    },
  }),
  /deadline/,
);

if (process.argv.includes("--live")) {
  for (const sourceId of ["github", "crabnebula"]) {
    const live = await fetchReleaseHistory(sourceId);
    assert.ok(live.assets.length);
    console.log(
      `Live ${sourceId}: latest v${live.version}; ${live.assets.map((asset) => `${asset.platform}/${asset.arch}/${asset.format}=v${asset.version}`).join(", ")}; historyComplete=${live.historyComplete}, partial=${live.partial}.`,
    );
  }
}

console.log(
  "Release history checks passed: independent platform/architecture/package versions, bounded history, partial failure and deadline recovery, official HTML rate-limit fallback, stable-only discovery, CrabNebula version matching and null results, seed immutability, source isolation and concurrency bounds.",
);
