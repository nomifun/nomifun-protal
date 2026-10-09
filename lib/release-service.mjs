import fs from "node:fs";
import { RELEASE_SOURCES } from "./downloads.mjs";
import { mergeDownloadCatalog } from "./download-catalog.mjs";
import { fetchReleaseHistory } from "./release-history.mjs";

const publishedSnapshot = JSON.parse(
  fs.readFileSync(new URL("./releases-snapshot.json", import.meta.url), "utf8"),
);

export const RELEASE_CACHE_MS = 60_000;
const CDN_STALE_SECONDS = 60;

function sendJson(res, status, body, cacheControl = "no-store") {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cacheControl);
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(body));
}

// This handler runs unchanged in Vercel's Node Function and local preview.
// The cache belongs to one warm process; the CDN also caches each source URL.
export function createReleaseService({
  fetchImpl = fetch,
  now = Date.now,
  timeoutMs = 10_000,
  seed = publishedSnapshot,
} = {}) {
  const cache = new Map();
  const pending = new Map();

  async function getRelease(sourceId) {
    const entry = cache.get(sourceId);
    if (entry && now() < entry.expiresAt) return entry;
    if (pending.has(sourceId)) return pending.get(sourceId);

    const refresh = (async () => {
      // Current metadata, history, and HTML fallback share one total deadline.
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const baseline = entry?.release ?? seed[sourceId];
        // A known version is only a candidate for this source's own upstream
        // query; binaries and versions are never copied between sources.
        const candidateVersions = [
          ...new Set(
            [
              ...Object.values(seed),
              ...[...cache.values()].map((value) => value.release),
            ]
              .filter(Boolean)
              .flatMap((release) => [
                release.version,
                ...(release.knownVersions ?? []),
                ...(release.assets ?? []).map((asset) => asset.version),
              ])
              .filter(Boolean),
          ),
        ];
        const incoming = await fetchReleaseHistory(sourceId, {
          fetchImpl,
          timeoutMs,
          signal: controller.signal,
          seed: baseline,
          candidateVersions,
        });
        const release = mergeDownloadCatalog(sourceId, baseline, incoming);
        const fresh = { release, expiresAt: now() + RELEASE_CACHE_MS };
        cache.set(sourceId, fresh);
        return fresh;
      } finally {
        clearTimeout(timeout);
      }
    })();
    pending.set(sourceId, refresh);
    try {
      return await refresh;
    } finally {
      pending.delete(sourceId);
    }
  }

  return async function releaseService(req, res) {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      sendJson(res, 405, { error: "method_not_allowed" });
      return;
    }

    let params;
    try {
      params = new URL(req.url, "http://localhost").searchParams;
    } catch {
      sendJson(res, 400, { error: "invalid_request" });
      return;
    }
    const sourceId = params.get("source");
    if (
      params.getAll("source").length !== 1 ||
      [...params.keys()].some((key) => key !== "source") ||
      !Object.hasOwn(RELEASE_SOURCES, sourceId)
    ) {
      sendJson(res, 400, {
        error: "invalid_source",
        sources: ["github", "crabnebula"],
      });
      return;
    }

    try {
      const entry = await getRelease(sourceId);
      // A cache hit must not start a second 60-second freshness window at the
      // CDN. The response retains the time of the actual upstream check.
      const remainingSeconds = Math.min(
        60,
        Math.max(1, Math.ceil((entry.expiresAt - now()) / 1000)),
      );
      sendJson(
        res,
        200,
        entry.release,
        `public, max-age=0, s-maxage=${remainingSeconds}, stale-while-revalidate=${CDN_STALE_SECONDS}`,
      );
    } catch {
      // Never label a cached release as freshly checked after upstream failure.
      // The client keeps its last successful result or build snapshot instead.
      sendJson(res, 503, {
        error: "release_unavailable",
        source: sourceId,
        stale: true,
        checkedAt:
          cache.get(sourceId)?.release.checkedAt ??
          seed[sourceId]?.checkedAt ??
          null,
      });
    }
  };
}
