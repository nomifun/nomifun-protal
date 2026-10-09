import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  createReleaseService,
  RELEASE_CACHE_MS,
} from "../lib/release-service.mjs";
import {
  RELEASE_SOURCES,
  isTrustedDownloadUrl,
  normalizeCrabNebulaRelease,
  normalizeGitHubRelease,
} from "../lib/downloads.mjs";
import { buildDownloadCatalog } from "../lib/download-catalog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const githubList =
  "https://api.github.com/repos/nomifun/nomifun-desktop/releases?per_page=30&page=1";
const githubHtmlList = "https://github.com/nomifun/nomifun-desktop/releases";
const oldCheck = "2026-10-01T00:00:00.000Z";
const releaseDate = (version) =>
  `2026-10-0${Number(version.split(".")[1]) + 1}T00:00:00.000Z`;
const allFormats = ["x64-setup.exe", "aarch64.dmg", "x64.AppImage"];

function githubRelease(version, formats) {
  return {
    tag_name: `v${version}`,
    published_at: releaseDate(version),
    draft: false,
    prerelease: false,
    assets: formats.map((format, index) => {
      const name = `NomiFun_${version}_${format}`;
      return {
        id: index + 1,
        name,
        state: "uploaded",
        size: 2048 + index,
        browser_download_url: `https://github.com/nomifun/nomifun-desktop/releases/download/v${version}/${name}`,
      };
    }),
  };
}
let nextAssetId = 1;
const assetIds = new Map();
function crabRelease(version, formats, replacement = "") {
  return {
    result: {
      type: "response",
      data: {
        version,
        pubDate: releaseDate(version),
        status: "Published",
        channel: null,
        assets: formats.map((format, index) => {
          const key = `${version}:${format}:${replacement}`;
          if (!assetIds.has(key))
            assetIds.set(key, String(nextAssetId++).padStart(26, "0"));
          return {
            assetId: assetIds.get(key),
            assetFilename: `NomiFun_${version}_${format}`,
            assetSize: 4096 + index,
          };
        }),
      },
    },
  };
}
function seedCatalog(source) {
  const release =
    source === "github"
      ? normalizeGitHubRelease(githubRelease("1.0.0", allFormats), oldCheck)
      : normalizeCrabNebulaRelease(crabRelease("1.0.0", allFormats), oldCheck);
  return buildDownloadCatalog([release], {
    historyComplete: source === "github",
    knownVersions: ["1.0.0"],
  });
}
function asset(catalog, platform) {
  const found = catalog.assets.find(
    (candidate) => candidate.platform === platform,
  );
  assert.ok(found, `${platform} installer must remain available`);
  return found;
}
async function withServer(handler, run) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await run((query, options) =>
      fetch(`${base}/api/releases${query}`, options),
    );
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

let time = 1_000;
const calls = { github: 0, crabnebula: 0, githubHistory: 0 };
const crabVersionQueries = new Set();
const oldGithub = githubRelease("1.0.0", allFormats);
const oldCrab = crabRelease("1.0.0", allFormats);
const oldCrabWithoutSizes = structuredClone(oldCrab);
for (const binary of oldCrabWithoutSizes.result.data.assets)
  delete binary.assetSize;
const seed = {
  github: seedCatalog("github"),
  crabnebula: seedCatalog("crabnebula"),
};
const state = {
  githubLatest: githubRelease("1.1.0", ["aarch64.dmg"]),
  githubHistory: [githubRelease("1.1.0", ["aarch64.dmg"]), oldGithub],
  crabLatest: crabRelease("1.0.5", ["aarch64.dmg"]),
  crabHistory: new Map([["1.0.0", oldCrabWithoutSizes]]),
  failGithub: false,
  failHistory: false,
};
let releaseFirst;
const firstResponse = new Promise((resolve) => {
  releaseFirst = resolve;
});
const handler = createReleaseService({
  seed,
  now: () => time,
  fetchImpl: async (url) => {
    if (url === RELEASE_SOURCES.github.metadataUrl) {
      calls.github += 1;
      if (calls.github === 1) await firstResponse;
      return state.failGithub
        ? new Response("rate limited", { status: 403 })
        : Response.json(state.githubLatest);
    }
    if (url === githubList) {
      calls.githubHistory += 1;
      return state.failGithub || state.failHistory
        ? new Response("unavailable", { status: 503 })
        : Response.json(state.githubHistory);
    }
    if ([RELEASE_SOURCES.github.releaseUrl, githubHtmlList].includes(url))
      return new Response("unavailable", { status: 503 });
    const parsed = new URL(url);
    assert.equal(
      parsed.origin + parsed.pathname,
      "https://api.crabnebula.app/directory/rspc/distribution.publicRelease.get",
      "upstream URL must stay fixed",
    );
    const input = JSON.parse(parsed.searchParams.get("input"));
    assert.equal(input.app, "nomifun-desktop");
    assert.equal(input.org, "nomifun");
    if (input.version === null) {
      calls.crabnebula += 1;
      return Response.json(state.crabLatest);
    }
    crabVersionQueries.add(input.version);
    return Response.json(
      state.crabHistory.get(input.version) ?? {
        result: { type: "response", data: null },
      },
    );
  },
});

await withServer(handler, async (request) => {
  for (const query of [
    "",
    "?source=unknown",
    "?source=constructor",
    "?source=github&source=crabnebula",
    "?source=github&url=https://example.com",
  ]) {
    const response = await request(query);
    assert.equal(response.status, 400, query);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  const post = await request("?source=github", { method: "POST" });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get("allow"), "GET");
  assert.deepEqual(calls, { github: 0, crabnebula: 0, githubHistory: 0 });
  const concurrent = Array.from({ length: 8 }, () => request("?source=github"));
  while (!calls.github) await new Promise((resolve) => setTimeout(resolve, 1));
  releaseFirst();
  const responses = await Promise.all(concurrent);
  assert.equal(calls.github, 1);
  assert.equal(
    calls.githubHistory,
    1,
    "history discovery must share concurrent refresh",
  );
  assert.equal(responses[0].status, 200);
  const initial = await responses[0].json();
  for (const response of responses.slice(1)) {
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), initial);
  }
  assert.equal(initial.version, "1.1.0");
  assert.equal(initial.historyComplete, true);
  assert.equal(initial.partial, false);
  assert.equal(asset(initial, "macos").version, "1.1.0");
  for (const platform of ["windows", "linux"])
    assert.equal(asset(initial, platform).version, "1.0.0");
  assert.notEqual(
    asset(initial, "windows").checkedAt,
    oldCheck,
    "queried old assets may update their own verification time",
  );
  const cnResponse = await request("?source=crabnebula");
  assert.equal(cnResponse.status, 200);
  const cn = await cnResponse.json();
  assert.equal(cn.version, "1.0.5");
  assert.equal(
    cn.historyComplete,
    false,
    "candidates do not imply a full directory",
  );
  assert.equal(cn.partial, false, "bounded discovery is not a failed refresh");
  assert.equal(asset(cn, "macos").version, "1.0.5");
  assert.equal(asset(cn, "windows").version, "1.0.0");
  assert.equal(
    asset(cn, "windows").size,
    asset(seed.crabnebula, "windows").size,
    "same immutable asset URL retains its verified size when metadata omits it",
  );
  assert.ok(
    crabVersionQueries.has("1.1.0"),
    "other-source versions may be lookup candidates",
  );
  assert.ok(
    !cn.knownVersions.includes("1.1.0"),
    "absent versions cannot be copied from GitHub",
  );
  for (const binary of cn.assets)
    assert.ok(isTrustedDownloadUrl("crabnebula", binary.url));
  time += 30_000;
  const cached = await request("?source=github");
  assert.equal(calls.github, 1);
  assert.match(cached.headers.get("cache-control"), /s-maxage=30,/);
  assert.equal((await cached.json()).checkedAt, initial.checkedAt);
  time += RELEASE_CACHE_MS;
  state.githubLatest = githubRelease("1.2.0", ["aarch64.dmg"]);
  state.failHistory = true;
  const partialResponse = await request("?source=github");
  assert.equal(partialResponse.status, 200);
  const partial = await partialResponse.json();
  assert.equal(partial.version, "1.2.0");
  assert.equal(partial.partial, true);
  assert.equal(partial.historyComplete, false);
  assert.equal(asset(partial, "macos").version, "1.2.0");
  for (const platform of ["windows", "linux"]) {
    assert.equal(asset(partial, platform).url, asset(initial, platform).url);
    assert.equal(
      asset(partial, platform).checkedAt,
      asset(initial, platform).checkedAt,
      "retained binaries must not look freshly checked",
    );
    assert.equal(asset(partial, platform).retained, true);
  }
  state.failHistory = false;
  assert.equal((await request("?source=crabnebula")).status, 200);
  assert.equal(calls.crabnebula, 2, "sources cache independently");
  time += RELEASE_CACHE_MS;
  state.githubLatest = githubRelease("1.1.0", ["aarch64.dmg"]);
  state.githubHistory = [state.githubLatest, oldGithub];
  const older = await (await request("?source=github")).json();
  assert.equal(
    asset(older, "macos").version,
    "1.2.0",
    "a delayed older response cannot downgrade a known platform binary",
  );
  time += RELEASE_CACHE_MS;
  state.failGithub = true;
  const failed = await request("?source=github");
  assert.equal(failed.status, 503);
  assert.equal(failed.headers.get("cache-control"), "no-store");
  assert.deepEqual(await failed.json(), {
    error: "release_unavailable",
    source: "github",
    stale: true,
    checkedAt: older.checkedAt,
  });
  assert.equal((await request("?source=crabnebula")).status, 200);
  state.failGithub = false;
  state.githubLatest = githubRelease("1.3.0", ["aarch64.dmg", "x64-setup.exe"]);
  state.githubHistory = [state.githubLatest, oldGithub];
  const recoveredResponse = await request("?source=github");
  assert.equal(recoveredResponse.status, 200);
  const recovered = await recoveredResponse.json();
  assert.equal(
    asset(recovered, "windows").version,
    "1.3.0",
    "a later Windows upload replaces the older Windows download",
  );
  assert.equal(asset(recovered, "linux").version, "1.0.0");
  assert.equal(asset(recovered, "linux").retained, false);
  assert.equal(recovered.partial, false);
});

await withServer(
  createReleaseService({
    seed: { github: seed.github },
    fetchImpl: async (url) =>
      url === RELEASE_SOURCES.github.metadataUrl
        ? Response.json(githubRelease("1.1.0", ["aarch64.dmg"]))
        : new Response("unavailable", { status: 503 }),
  }),
  async (request) => {
    const response = await request("?source=github");
    assert.equal(response.status, 200);
    const cold = await response.json();
    for (const platform of ["windows", "linux"]) {
      assert.equal(asset(cold, platform).version, "1.0.0");
      assert.equal(asset(cold, platform).retained, true);
      assert.equal(asset(cold, platform).checkedAt, oldCheck);
    }
  },
);
const newerSeed = buildDownloadCatalog(
  [
    normalizeGitHubRelease(githubRelease("1.2.0", ["aarch64.dmg"]), oldCheck),
    normalizeGitHubRelease(oldGithub, oldCheck),
  ],
  { historyComplete: true },
);
await withServer(
  createReleaseService({
    seed: { github: newerSeed },
    fetchImpl: async (url) =>
      url === githubList
        ? Response.json([githubRelease("1.1.0", ["aarch64.dmg"]), oldGithub])
        : new Response("unavailable", { status: 503 }),
  }),
  async (request) => {
    const response = await request("?source=github");
    assert.equal(response.status, 200);
    const retainedLatest = await response.json();
    assert.equal(
      retainedLatest.version,
      "1.2.0",
      "an older history response cannot relabel the known newest release when latest lookup fails",
    );
    assert.equal(
      retainedLatest.checkedAt,
      oldCheck,
      "an unresolved latest lookup cannot advance its verification time",
    );
    assert.equal(retainedLatest.partial, true);
    assert.equal(asset(retainedLatest, "macos").version, "1.2.0");
  },
);

for (const timeoutSeed of [{}, { crabnebula: seed.crabnebula }]) {
  await withServer(
    createReleaseService({
      seed: timeoutSeed,
      timeoutMs: 15,
      fetchImpl: (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          if (signal.aborted) return reject(new Error("timeout"));
          signal.addEventListener("abort", () => reject(new Error("timeout")), {
            once: true,
          });
        }),
    }),
    async (request) => {
      const response = await request("?source=crabnebula");
      assert.equal(
        response.status,
        503,
        "cold seed cannot fabricate a fresh response",
      );
      assert.equal(
        (await response.json()).checkedAt,
        timeoutSeed.crabnebula?.checkedAt ?? null,
      );
    },
  );
}
let cnTime = 0;
let cnReplacement = "";
let cnHistoryFails = true;
await withServer(
  createReleaseService({
    seed: { crabnebula: seed.crabnebula },
    now: () => cnTime,
    fetchImpl: async (url) => {
      if (
        url.startsWith("https://github.com/") ||
        url.startsWith("https://api.github.com/")
      )
        return new Response("unavailable", { status: 503 });
      const version = JSON.parse(
        new URL(url).searchParams.get("input"),
      ).version;
      if (version === null) {
        const latest = crabRelease("1.2.0", ["aarch64.dmg"], cnReplacement);
        if (cnReplacement)
          for (const binary of latest.result.data.assets)
            delete binary.assetSize;
        return Response.json(latest);
      }
      assert.equal(version, "1.0.0");
      return cnHistoryFails
        ? new Response("unavailable", { status: 503 })
        : Response.json(oldCrab);
    },
  }),
  async (request) => {
    const first = await (await request("?source=crabnebula")).json();
    assert.equal(first.partial, true);
    assert.equal(asset(first, "windows").checkedAt, oldCheck);
    assert.equal(asset(first, "windows").retained, true);
    cnTime += RELEASE_CACHE_MS;
    cnReplacement = "replacement";
    cnHistoryFails = false;
    const second = await (await request("?source=crabnebula")).json();
    assert.notEqual(
      asset(second, "macos").url,
      asset(first, "macos").url,
      "same-version re-upload must update the pinned asset ID",
    );
    assert.equal(
      asset(second, "macos").size,
      null,
      "a replacement URL cannot inherit the previous binary's size",
    );
    assert.equal(asset(second, "windows").retained, false);
  },
);

const fallbackRequests = [];
await withServer(
  createReleaseService({
    seed: {},
    fetchImpl: async (url) => {
      fallbackRequests.push(url);
      if (url.startsWith("https://api.github.com/"))
        return new Response("rate limited", { status: 403 });
      if (url === RELEASE_SOURCES.github.releaseUrl) {
        const response = new Response(
          `<relative-time datetime="${releaseDate("1.4.0")}"></relative-time>`,
        );
        Object.defineProperty(response, "url", {
          value:
            "https://github.com/nomifun/nomifun-desktop/releases/tag/v1.4.0",
        });
        return response;
      }
      if (url === githubHtmlList)
        return new Response(
          ["1.4.0", "1.0.0"]
            .map(
              (version) =>
                `<section data-release-anchor="release-v${version}"><relative-time datetime="${releaseDate(version)}"></relative-time></section>`,
            )
            .join(""),
        );
      const tag = new URL(url).pathname.split("/").at(-1);
      assert.ok(["v1.4.0", "v1.0.0"].includes(tag));
      const release =
        tag === "v1.4.0" ? githubRelease("1.4.0", ["aarch64.dmg"]) : oldGithub;
      return new Response(
        release.assets
          .map(
            (binary) =>
              `<a href="${new URL(binary.browser_download_url).pathname}">package</a>`,
          )
          .join("\n"),
      );
    },
  }),
  async (request) => {
    const response = await request("?source=github");
    assert.equal(response.status, 200);
    const fallback = await response.json();
    assert.equal(fallback.version, "1.4.0");
    assert.equal(asset(fallback, "windows").version, "1.0.0");
    assert.equal(fallback.historyComplete, true);
    assert.ok(
      fallbackRequests.includes(githubHtmlList),
      "API limits must recover historical platforms through release HTML",
    );
  },
);
await withServer(
  createReleaseService({
    seed: {},
    timeoutMs: 20,
    fetchImpl: async (url, { signal }) => {
      if (url.startsWith("https://api.github.com/"))
        return new Response("rate limited", { status: 403 });
      assert.ok(
        [RELEASE_SOURCES.github.releaseUrl, githubHtmlList].includes(url),
      );
      return new Promise((_resolve, reject) => {
        if (signal.aborted) return reject(new Error("fallback timeout"));
        signal.addEventListener(
          "abort",
          () => reject(new Error("fallback timeout")),
          { once: true },
        );
      });
    },
  }),
  async (request) =>
    assert.equal((await request("?source=github")).status, 503),
);

if (process.argv.includes("--packaged")) {
  const output = path.join(root, ".vercel/output");
  const config = JSON.parse(
    await fs.readFile(path.join(output, "config.json"), "utf8"),
  );
  const functionDir = path.join(output, "functions/api/releases.func");
  const functionConfig = JSON.parse(
    await fs.readFile(path.join(functionDir, ".vc-config.json"), "utf8"),
  );
  assert.equal(config.version, 3);
  assert.equal(functionConfig.runtime, "nodejs22.x");
  assert.equal(functionConfig.launcherType, "Nodejs");
  assert.equal(functionConfig.maxDuration, 15);
  assert.ok(config.routes.some((route) => route.dest === "/api/releases"));
  for (const relative of [
    "lib/download-catalog.mjs",
    "lib/release-history.mjs",
    "lib/releases-snapshot.json",
  ])
    assert.ok(
      (await fs.readFile(path.join(functionDir, relative))).equals(
        await fs.readFile(path.join(root, relative)),
      ),
      `${relative} must be current in the function package`,
    );
  for (const page of [
    "/",
    "/zh",
    "/en",
    "/zh/download",
    "/en/products/desktop",
    "/products/mobile",
  ]) {
    const route = config.routes.find(
      (candidate) => candidate.dest && new RegExp(candidate.src).test(page),
    );
    assert.ok(
      route?.dest.endsWith(".html"),
      `${page} must resolve to a static HTML page`,
    );
    assert.ok(
      (await fs.readFile(path.join(output, "static", route.dest))).equals(
        await fs.readFile(path.join(root, "out", route.dest)),
      ),
      `${page} must preserve the Next export`,
    );
  }
  const packaged = await import(
    pathToFileURL(path.join(functionDir, functionConfig.handler))
  );
  await withServer(packaged.default, async (request) => {
    assert.equal((await request("?source=invalid")).status, 400);
    if (process.argv.includes("--live"))
      for (const source of ["github", "crabnebula"]) {
        const response = await request(`?source=${source}`);
        assert.equal(response.status, 200, `${source} live packaged handler`);
        const release = await response.json();
        assert.ok(
          release.version && release.checkedAt && release.assets.length,
        );
        for (const binary of release.assets) {
          assert.ok(isTrustedDownloadUrl(source, binary.url));
          assert.ok(binary.version && binary.checkedAt && binary.releaseUrl);
        }
        console.log(
          `Packaged live ${source}: latest v${release.version}, ${release.assets.length} platform installers, checked ${release.checkedAt}.`,
        );
      }
  });
}
console.log(
  "Release service checks passed: cold snapshot retention, per-platform versions, independent caches, concurrent refresh, bounded freshness, fixed upstreams, source isolation, partial history, stale timestamps, later uploads, re-uploaded IDs, no downgrade, explicit failure, shared timeout, GitHub HTML history fallback and recovery.",
);
