import { fetchRelease, RELEASE_SOURCES } from "./downloads.mjs";
import { fetchGitHubHtmlRelease } from "./github-release-html.mjs";

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
} = {}) {
  const cache = new Map();
  const pending = new Map();

  async function getRelease(sourceId) {
    const entry = cache.get(sourceId);
    if (entry && now() < entry.expiresAt) return entry;
    if (pending.has(sourceId)) return pending.get(sourceId);

    const refresh = (async () => {
      // The API request and optional HTML fallback share one total deadline.
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);
      try {
        let release;
        try {
          release = await fetchRelease(sourceId, {
            fetchImpl,
            timeoutMs,
            signal: controller.signal,
          });
        } catch (error) {
          if (sourceId !== "github" || controller.signal.aborted) throw error;
          release = await fetchGitHubHtmlRelease({
            fetchImpl,
            timeoutMs,
            signal: controller.signal,
          });
        }
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
        checkedAt: cache.get(sourceId)?.release.checkedAt ?? null,
      });
    }
  };
}
