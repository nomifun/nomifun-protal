// Server/build helper. GitHub's release HTML is not readable across origins in
// a browser, so browser components should use the same-origin release service.
import {
  RELEASE_SOURCES,
  normalizeGitHubRelease,
  readLimitedText,
} from "./downloads.mjs";

export async function fetchGitHubHtmlRelease(options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 10000,
  );
  const forwardAbort = () => controller.abort(options.signal?.reason);
  if (options.signal?.aborted) forwardAbort();
  options.signal?.addEventListener("abort", forwardAbort, { once: true });
  const signal = controller.signal;
  const fetchImpl = options.fetchImpl ?? fetch;
  try {
    const page = await fetchImpl(RELEASE_SOURCES.github.releaseUrl, {
      signal,
      cache: "no-store",
    });
    if (!page.ok)
      throw new Error(`GitHub release page returned HTTP ${page.status}.`);
    const pageUrl = new URL(page.url);
    const tagMatch = pageUrl.pathname.match(
      /^\/nomifun\/nomifun-desktop\/releases\/tag\/([^/]+)$/,
    );
    if (pageUrl.origin !== "https://github.com" || !tagMatch) {
      throw new Error("GitHub latest page did not identify a release tag.");
    }
    const tag = decodeURIComponent(tagMatch[1]);
    const html = await readLimitedText(page);
    const publishedAt = html.match(
      /<relative-time\b[^>]*datetime="([^"]+)"/,
    )?.[1];
    if (!publishedAt || !Number.isFinite(Date.parse(publishedAt))) {
      throw new Error("GitHub release page has no readable publish date.");
    }
    const fragment = await fetchImpl(
      `https://github.com/nomifun/nomifun-desktop/releases/expanded_assets/${encodeURIComponent(tag)}`,
      { signal, cache: "no-store" },
    );
    if (!fragment.ok)
      throw new Error(`GitHub asset list returned HTTP ${fragment.status}.`);
    const assetsHtml = await readLimitedText(fragment);
    const assetPrefix = `/nomifun/nomifun-desktop/releases/download/${tag}/`;
    const assets = [
      ...assetsHtml.matchAll(
        /href="(\/nomifun\/nomifun-desktop\/releases\/download\/[^"<>]+)"/g,
      ),
    ]
      .map(([, pathname]) => {
        const url = new URL(
          pathname.replaceAll("&amp;", "&"),
          "https://github.com",
        );
        // A stale or mismatched expanded-assets response must not be presented
        // as the latest tag that the first request just resolved.
        if (!decodeURIComponent(url.pathname).startsWith(assetPrefix))
          return null;
        return {
          id: decodeURIComponent(url.pathname.split("/").at(-1)),
          name: decodeURIComponent(url.pathname.split("/").at(-1)),
          browser_download_url: url.href,
        };
      })
      .filter(Boolean);
    if (!assets.length)
      throw new Error(
        "GitHub release page has no readable asset list for the latest tag.",
      );
    return normalizeGitHubRelease({
      tag_name: tag,
      published_at: publishedAt,
      assets,
    });
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener("abort", forwardAbort);
  }
}
