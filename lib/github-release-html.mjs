// Server/build helper. GitHub's release HTML is not readable across origins in
// a browser, so browser components should use the same-origin release service.
import {
  RELEASE_SOURCES,
  normalizeGitHubRelease,
  readLimitedText,
} from "./downloads.mjs";

const repositoryUrl = "https://github.com/nomifun/nomifun-desktop";

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

// Only release sections carry a release tag. Matching arbitrary links would
// accidentally include release-note links to prereleases or unrelated tags.
export function parseGitHubReleaseSections(html) {
  const releases = [];
  let malformed = false;
  let sectionCount = 0;
  for (const section of html.matchAll(
    /<section\b[^>]*\bdata-release-anchor="([^"]+)"[^>]*>([\s\S]*?)<\/section>/gi,
  )) {
    sectionCount += 1;
    const [, anchor, body] = section;
    if (
      /<span\b[^>]*class="[^"]*\bLabel\b[^"]*"[^>]*>\s*(?:Pre-release|Draft)\s*<\/span>/i.test(
        body,
      )
    )
      continue;
    const tag = decodeHtml(anchor.replace(/^release-/, ""));
    const publishedAt = body.match(
      /<relative-time\b[^>]*datetime="([^"]+)"/i,
    )?.[1];
    if (
      !tag ||
      tag.length > 100 ||
      !publishedAt ||
      !Number.isFinite(Date.parse(publishedAt))
    ) {
      malformed = true;
      continue;
    }
    releases.push({ tag_name: tag, published_at: publishedAt, assets: [] });
  }
  let nextUrl = null;
  for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
    if (!/\brel="next"/i.test(match[0])) continue;
    const href = match[0].match(/\bhref="([^"]+)"/i)?.[1];
    if (!href) continue;
    try {
      const url = new URL(decodeHtml(href), repositoryUrl);
      // Pagination stays on this public repository. A response cannot direct
      // the server to an arbitrary host or URL with its pagination markup.
      if (
        url.origin === "https://github.com" &&
        url.pathname === "/nomifun/nomifun-desktop/releases" &&
        /^\d+$/.test(url.searchParams.get("page") ?? "")
      ) {
        nextUrl = url.href;
        break;
      }
    } catch {}
  }
  return { releases, nextUrl, malformed, sectionCount };
}

export function parseGitHubAssetHtml(html, tag) {
  const assetPrefix = `/nomifun/nomifun-desktop/releases/download/${tag}/`;
  const assets = new Map();
  for (const [, pathname] of html.matchAll(
    /href="(\/nomifun\/nomifun-desktop\/releases\/download\/[^"<>]+)"/g,
  )) {
    try {
      const url = new URL(decodeHtml(pathname), "https://github.com");
      if (!decodeURIComponent(url.pathname).startsWith(assetPrefix)) continue;
      const name = decodeURIComponent(url.pathname.split("/").at(-1));
      assets.set(url.href, { id: name, name, browser_download_url: url.href });
    } catch {}
  }
  return [...assets.values()];
}

// The caller owns the total deadline and concurrency for historical asset
// requests; this helper also enforces the existing 2 MiB response bound.
export async function fetchGitHubTagAssets(
  tag,
  { fetchImpl = fetch, signal } = {},
) {
  const response = await fetchImpl(
    `${repositoryUrl}/releases/expanded_assets/${encodeURIComponent(tag)}`,
    { signal, cache: "no-store" },
  );
  if (!response.ok)
    throw new Error(`GitHub asset list returned HTTP ${response.status}.`);
  const html = await readLimitedText(response);
  const assets = parseGitHubAssetHtml(html, tag);
  // Empty releases exist, but an unknown or mismatched HTML response must not
  // silently claim that all installers were deleted.
  if (
    !assets.length &&
    !/There are no assets|No assets|<ul\b[^>]*class="[^"]*release-assets/i.test(
      html,
    )
  ) {
    throw new Error(
      "GitHub release page has no readable asset list for this tag.",
    );
  }
  return assets;
}

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
    let pageUrl;
    try {
      pageUrl = new URL(page.url);
    } catch {
      throw new Error("GitHub latest page did not identify a release tag.");
    }
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
