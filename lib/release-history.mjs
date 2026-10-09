// Server/build-only discovery. Installers retain their own release version:
// the latest macOS release must not hide a Windows or Linux installer.
import {
  RELEASE_SOURCES,
  normalizeGitHubRelease,
  normalizeCrabNebulaRelease,
  readLimitedText,
} from "./downloads.mjs";
import {
  fetchGitHubHtmlRelease,
  fetchGitHubTagAssets,
  parseGitHubReleaseSections,
} from "./github-release-html.mjs";
import { buildDownloadCatalog } from "./download-catalog.mjs";

const GITHUB_LIST =
  "https://api.github.com/repos/nomifun/nomifun-desktop/releases";
const GITHUB_HTML_LIST = "https://github.com/nomifun/nomifun-desktop/releases";
const MAX_GITHUB_PAGES = 4;
const MAX_GITHUB_RELEASES = 40;
const MAX_CRABNEBULA_VERSIONS = 20;
const MAX_CONCURRENT = 4;

function withAssetRelease(release) {
  return {
    ...release,
    assets: release.assets.map((asset) => ({
      ...asset,
      version: release.version,
      publishedAt: release.publishedAt,
      releaseUrl: release.releaseUrl,
      checkedAt: release.checkedAt,
    })),
  };
}

function stableVersion(value) {
  if (typeof value !== "string" || !value.trim() || value.length > 100)
    return null;
  return value.trim().replace(/^v(?=\d)/, "");
}

function releaseDate(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function createContext(options) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(new Error("Release history deadline exceeded.")),
    options.timeoutMs ?? 10_000,
  );
  const forwardAbort = () => controller.abort(options.signal?.reason);
  if (options.signal?.aborted) forwardAbort();
  options.signal?.addEventListener("abort", forwardAbort, { once: true });
  const upstreamFetch = options.fetchImpl ?? fetch;
  let active = 0;
  const queue = [];
  const abortError = () =>
    controller.signal.reason ?? new Error("Release history aborted.");
  const fetchImpl = async (url, init = {}) => {
    if (controller.signal.aborted) throw abortError();
    if (active >= MAX_CONCURRENT) {
      await new Promise((resolve, reject) => {
        const onAbort = () => {
          const index = queue.indexOf(entry);
          if (index >= 0) queue.splice(index, 1);
          reject(abortError());
        };
        const entry = {
          resolve: () => {
            controller.signal.removeEventListener("abort", onAbort);
            resolve();
          },
        };
        queue.push(entry);
        controller.signal.addEventListener("abort", onAbort, { once: true });
      });
    } else active += 1;
    try {
      if (controller.signal.aborted) throw abortError();
      const response = await upstreamFetch(url, {
        ...init,
        signal: controller.signal,
      });
      // Hold the permit until the entire bounded response is read, not merely
      // until its headers arrive. Asset fragments and latest checks share the
      // same maximum of four complete requests.
      const body = await readLimitedText(response);
      const buffered = new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
      Object.defineProperty(buffered, "url", { value: response.url });
      return buffered;
    } finally {
      active -= 1;
      const queued = queue.shift();
      if (queued) {
        active += 1;
        queued.resolve();
      }
    }
  };
  return {
    signal: controller.signal,
    fetchImpl,
    close() {
      clearTimeout(timeout);
      options.signal?.removeEventListener("abort", forwardAbort);
    },
  };
}

async function requestJson(url, context) {
  const response = await context.fetchImpl(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok)
    throw new Error(`Release metadata returned HTTP ${response.status}.`);
  return JSON.parse(await readLimitedText(response));
}

async function settledMap(values, task) {
  let next = 0;
  const results = new Array(values.length);
  await Promise.all(
    Array.from(
      { length: Math.min(MAX_CONCURRENT, values.length) },
      async () => {
        while (next < values.length) {
          const index = next++;
          try {
            results[index] = {
              status: "fulfilled",
              value: await task(values[index]),
            };
          } catch (reason) {
            results[index] = { status: "rejected", reason };
          }
        }
      },
    ),
  );
  return results;
}

function normalizeGitHubPayload(payload) {
  if (!releaseDate(payload?.published_at))
    throw new Error("GitHub release has no valid publish date.");
  return withAssetRelease(normalizeGitHubRelease(payload));
}

async function githubApiHistory(context) {
  const releases = [];
  let historyComplete = true;
  let partial = false;
  for (let page = 1; page <= MAX_GITHUB_PAGES; page += 1) {
    let payload;
    try {
      payload = await requestJson(
        `${GITHUB_LIST}?per_page=30&page=${page}`,
        context,
      );
      if (!Array.isArray(payload))
        throw new Error("GitHub release history is not a list.");
    } catch (error) {
      if (page === 1) throw error;
      return { releases, historyComplete: false, partial: true };
    }
    for (let index = 0; index < payload.length; index += 1) {
      const item = payload[index];
      if (item?.draft || item?.prerelease) continue;
      try {
        releases.push(normalizeGitHubPayload(item));
      } catch {
        historyComplete = false;
        partial = true;
      }
      if (releases.length === MAX_GITHUB_RELEASES) {
        const truncated = index < payload.length - 1 || payload.length === 30;
        return {
          releases,
          historyComplete: historyComplete && !truncated,
          partial: partial || truncated,
        };
      }
    }
    if (payload.length < 30) return { releases, historyComplete, partial };
  }
  return { releases, historyComplete: false, partial: true };
}

async function githubHtmlHistory(context, includeAssets) {
  const descriptors = [];
  const seen = new Set();
  let nextUrl = GITHUB_HTML_LIST;
  let historyComplete = true;
  let partial = false;
  for (let page = 1; nextUrl && page <= MAX_GITHUB_PAGES; page += 1) {
    try {
      const response = await context.fetchImpl(nextUrl, { cache: "no-store" });
      if (!response.ok)
        throw new Error(
          `GitHub history page returned HTTP ${response.status}.`,
        );
      const html = await readLimitedText(response);
      const parsed = parseGitHubReleaseSections(html);
      if (
        !parsed.sectionCount &&
        !/<h[12]\b[^>]*>\s*There aren.t any releases/i.test(html)
      ) {
        // An unexpected page is a partial failure, not authoritative evidence
        // that every historical installer disappeared.
        if (!descriptors.length)
          throw new Error(
            "GitHub history page has no readable published releases.",
          );
        historyComplete = false;
        partial = true;
      }
      if (parsed.malformed) {
        historyComplete = false;
        partial = true;
      }
      for (const descriptor of parsed.releases) {
        if (seen.has(descriptor.tag_name)) continue;
        seen.add(descriptor.tag_name);
        descriptors.push(descriptor);
        if (descriptors.length === MAX_GITHUB_RELEASES) break;
      }
      nextUrl = parsed.nextUrl;
      if (descriptors.length === MAX_GITHUB_RELEASES) {
        if (
          nextUrl ||
          parsed.releases.some((release) => !seen.has(release.tag_name))
        ) {
          historyComplete = false;
          partial = true;
        }
        nextUrl = null;
        break;
      }
    } catch (error) {
      if (!descriptors.length) throw error;
      historyComplete = false;
      partial = true;
      break;
    }
  }
  if (nextUrl) {
    historyComplete = false;
    partial = true;
  }
  const fetched = await settledMap(descriptors, async (descriptor) =>
    normalizeGitHubPayload({
      ...descriptor,
      assets: includeAssets
        ? await fetchGitHubTagAssets(descriptor.tag_name, context)
        : [],
    }),
  );
  const releases = fetched
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
  if (fetched.some((result) => result.status === "rejected")) {
    historyComplete = false;
    partial = true;
  }
  return { releases, historyComplete, partial };
}

// Kept separate from latest resolution: an incomplete history scan must not
// discard a successful latest check. includeAssets=false gathers official
// stable tags for CrabNebula without querying every GitHub asset fragment.
async function githubHistory(context, includeAssets = true) {
  try {
    return await githubApiHistory(context);
  } catch (error) {
    if (context.signal.aborted) throw error;
    return githubHtmlHistory(context, includeAssets);
  }
}

async function githubLatest(context, options) {
  try {
    return normalizeGitHubPayload(
      await requestJson(RELEASE_SOURCES.github.metadataUrl, context),
    );
  } catch (error) {
    if (context.signal.aborted) throw error;
    return withAssetRelease(
      await fetchGitHubHtmlRelease({
        ...context,
        timeoutMs: options.timeoutMs ?? 10_000,
      }),
    );
  }
}

export async function fetchGitHubHistory(options = {}) {
  const context = createContext(options);
  try {
    const result = await githubHistory(
      context,
      options.includeAssets !== false,
    );
    if (!result.releases.length)
      throw new Error("GitHub has no readable published releases.");
    return {
      ...result,
      knownVersions: [
        ...new Set(result.releases.map((release) => release.version)),
      ],
    };
  } finally {
    context.close();
  }
}

function crabnebulaUrl(version) {
  const input = encodeURIComponent(
    JSON.stringify({ app: "nomifun-desktop", org: "nomifun", version }),
  );
  return `https://api.crabnebula.app/directory/rspc/distribution.publicRelease.get?input=${input}`;
}

async function crabnebulaRelease(version, context) {
  const payload = await requestJson(crabnebulaUrl(version), context);
  const release =
    payload?.result?.type === "response" ? payload.result.data : payload;
  // The public lookup returns null for a version absent from this platform.
  if (
    version !== null &&
    payload?.result?.type === "response" &&
    release === null
  )
    return null;
  if (
    version !== null &&
    release &&
    (release.status === "Draft" ||
      (release.status === "Published" &&
        typeof release.channel === "string" &&
        release.channel))
  )
    return null;
  if (
    release?.status !== "Published" ||
    release.channel !== null ||
    !releaseDate(release.pubDate)
  ) {
    throw new Error("CrabNebula has no valid published stable release.");
  }
  const normalized = withAssetRelease(normalizeCrabNebulaRelease(payload));
  if (version !== null && normalized.version !== version) {
    throw new Error(
      "CrabNebula historical lookup returned a different version.",
    );
  }
  return normalized;
}

export async function fetchReleaseHistory(sourceId, options = {}) {
  if (!Object.hasOwn(RELEASE_SOURCES, sourceId))
    throw new Error("Unknown release source.");
  const context = createContext(options);
  try {
    if (sourceId === "github") {
      const [latest, history] = await Promise.allSettled([
        githubLatest(context, options),
        githubHistory(context),
      ]);
      const releases = [
        ...(latest.status === "fulfilled" ? [latest.value] : []),
        ...(history.status === "fulfilled" ? history.value.releases : []),
      ];
      if (!releases.length)
        throw latest.status === "rejected"
          ? latest.reason
          : new Error("GitHub has no valid release metadata.");
      return buildDownloadCatalog(releases, {
        latestRelease: latest.status === "fulfilled" ? latest.value : null,
        historyComplete:
          history.status === "fulfilled" && history.value.historyComplete,
        knownVersions: releases.map((release) => release.version),
        partial:
          history.status === "rejected" ||
          latest.status === "rejected" ||
          history.value.partial,
      });
    }

    const latestTask = crabnebulaRelease(null, context);
    const historyTask = githubHistory(context, false).catch(() => ({
      releases: [],
      partial: true,
    }));
    const [latest, github] = await Promise.allSettled([
      latestTask,
      historyTask,
    ]);
    // A failure checking this platform's own latest release preserves the old
    // snapshot at the service boundary rather than fabricating a fresh one.
    if (latest.status === "rejected") throw latest.reason;
    const discoveredCandidates = [
      ...new Set(
        [
          ...(options.seed?.assets ?? []).map((asset) => asset.version),
          ...(github.status === "fulfilled"
            ? [...github.value.releases]
                .sort(
                  (left, right) =>
                    Date.parse(right.publishedAt) -
                    Date.parse(left.publishedAt),
                )
                .map((release) => release.version)
            : []),
          ...(options.candidateVersions ?? []),
          options.seed?.version,
          ...(options.seed?.knownVersions ?? []),
        ]
          .map(stableVersion)
          .filter((version) => version && version !== latest.value.version),
      ),
    ];
    const candidates = discoveredCandidates.slice(0, MAX_CRABNEBULA_VERSIONS);
    const history = await settledMap(candidates, (version) =>
      crabnebulaRelease(version, context),
    );
    const releases = [
      latest.value,
      ...history
        .filter((result) => result.status === "fulfilled" && result.value)
        .map((result) => result.value),
    ];
    // Candidate tags are discovery hints, not CrabNebula's full release index.
    // Only versions actually returned by CrabNebula become knownVersions.
    return buildDownloadCatalog(releases, {
      latestRelease: latest.value,
      historyComplete: false,
      knownVersions: releases.map((release) => release.version),
      partial:
        discoveredCandidates.length > MAX_CRABNEBULA_VERSIONS ||
        github.status === "rejected" ||
        github.value.partial ||
        history.some((result) => result.status === "rejected"),
    });
  } finally {
    context.close();
  }
}
