const githubRepository = "https://github.com/nomifun/nomifun-desktop";
const crabnebulaInput = encodeURIComponent(
  JSON.stringify({ app: "nomifun-desktop", org: "nomifun", version: null }),
);

export const RELEASE_SOURCES = {
  github: {
    name: "GitHub",
    metadataUrl:
      "https://api.github.com/repos/nomifun/nomifun-desktop/releases/latest",
    releaseUrl: `${githubRepository}/releases/latest`,
  },
  crabnebula: {
    name: "CrabNebula",
    metadataUrl: `https://api.crabnebula.app/directory/rspc/distribution.publicRelease.get?input=${crabnebulaInput}`,
    releaseUrl: "https://crabnebula.cloud/nomifun/nomifun-desktop/releases",
  },
};

const formats = {
  exe: "windows",
  msi: "windows",
  dmg: "macos",
  appimage: "linux",
  deb: "linux",
  rpm: "linux",
};
const architecturePatterns = [
  ["arm64", /(?:^|[._-])(?:aarch64|arm64)(?=[._-]|$)/i],
  ["universal", /(?:^|[._-])universal2?(?=[._-]|$)/i],
  ["x64", /(?:^|[._-])(?:x86_64|x64|amd64)(?=[._-]|$)/i],
  ["x86", /(?:^|[._-])(?:i[3-6]86|x86|ia32)(?=[._-]|$)/i],
];

// Updater archives, signatures, checksums, source archives, and unknown CPU
// architectures are deliberately excluded from end-user installer choices.
export function classifyInstaller(name, platformHint = "") {
  if (typeof name !== "string") return null;
  const extension = name.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  const platform = formats[extension];
  if (!platform) return null;
  const arch =
    architecturePatterns.find(([, pattern]) => pattern.test(name))?.[0] ??
    architecturePatterns.find(([, pattern]) => pattern.test(platformHint))?.[0];
  return arch ? { platform, arch, format: extension } : null;
}

function validVersion(value) {
  if (typeof value !== "string" || !value.trim() || value.length > 100) {
    throw new Error("Release metadata has no valid version.");
  }
  return value.replace(/^v(?=\d)/, "");
}

function dateOrNull(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value))
    ? new Date(value).toISOString()
    : null;
}

function sizeOrNull(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

export function isTrustedDownloadUrl(sourceId, value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return false;
    if (sourceId === "github") {
      return (
        url.origin === "https://github.com" &&
        url.pathname.startsWith("/nomifun/nomifun-desktop/releases/download/")
      );
    }
    if (sourceId === "crabnebula") {
      return (
        url.origin === "https://cdn.crabnebula.app" &&
        /^\/asset\/[0-9A-HJKMNP-TV-Z]{26}$/.test(url.pathname)
      );
    }
  } catch {}
  return false;
}

function installer(sourceId, asset, hint = "") {
  const classification = classifyInstaller(asset.name, hint);
  if (!classification || !isTrustedDownloadUrl(sourceId, asset.url))
    return null;
  return {
    id: String(asset.id ?? asset.name),
    name: asset.name,
    url: asset.url,
    ...classification,
    size: sizeOrNull(asset.size),
  };
}

export function normalizeGitHubRelease(
  payload,
  checkedAt = new Date().toISOString(),
) {
  if (
    !payload ||
    payload.draft ||
    payload.prerelease ||
    !Array.isArray(payload.assets)
  ) {
    throw new Error("GitHub did not return a published stable release.");
  }
  const version = validVersion(payload.tag_name);
  const tag = encodeURIComponent(payload.tag_name);
  return {
    version,
    publishedAt: dateOrNull(payload.published_at),
    releaseUrl: `${githubRepository}/releases/tag/${tag}`,
    checkedAt: dateOrNull(checkedAt),
    assets: payload.assets
      .filter(
        (asset) => asset?.state === undefined || asset.state === "uploaded",
      )
      .map((asset) =>
        installer("github", {
          id: asset.id,
          name: asset.name,
          url: asset.browser_download_url,
          size: asset.size,
        }),
      )
      .filter(Boolean),
  };
}

export function normalizeCrabNebulaRelease(
  payload,
  checkedAt = new Date().toISOString(),
) {
  const release =
    payload?.result?.type === "response" ? payload.result.data : payload;
  if (
    !release ||
    release.status !== "Published" ||
    release.channel ||
    !Array.isArray(release.assets)
  ) {
    throw new Error("CrabNebula did not return a published stable release.");
  }
  return {
    version: validVersion(release.version),
    publishedAt: dateOrNull(release.pubDate),
    releaseUrl: RELEASE_SOURCES.crabnebula.releaseUrl,
    checkedAt: dateOrNull(checkedAt),
    assets: release.assets
      .map((asset) =>
        installer(
          "crabnebula",
          {
            id: asset.assetId ?? asset.id,
            name: asset.assetFilename ?? asset.filename,
            // Pin the binary to this metadata's version. A /latest/ URL can
            // advance while the visitor is still comparing release versions.
            url: `https://cdn.crabnebula.app/asset/${asset.assetId ?? asset.id}`,
            size: asset.assetSize ?? asset.size,
          },
          asset.publicPlatform ?? "",
        ),
      )
      .filter(Boolean),
  };
}

export function normalizeRelease(
  sourceId,
  payload,
  checkedAt = new Date().toISOString(),
) {
  if (!RELEASE_SOURCES[sourceId]) throw new Error("Unknown release source.");
  // A same-origin proxy or exported manifest can return already-normalized
  // metadata. Keep its check time: retrieving a static file is not an upstream
  // check and must not make an old snapshot look freshly synchronized.
  if (
    payload &&
    "checkedAt" in payload &&
    "publishedAt" in payload &&
    Array.isArray(payload.assets)
  ) {
    const version = validVersion(payload.version);
    let releaseUrl = RELEASE_SOURCES[sourceId].releaseUrl;
    if (sourceId === "github") {
      try {
        const url = new URL(payload.releaseUrl);
        if (
          url.origin === "https://github.com" &&
          /^\/nomifun\/nomifun-desktop\/releases\/tag\/[^/]+$/.test(
            url.pathname,
          )
        ) {
          releaseUrl = url.href;
        }
      } catch {}
    }
    return {
      version,
      publishedAt: dateOrNull(payload.publishedAt),
      releaseUrl,
      checkedAt: dateOrNull(payload.checkedAt),
      assets: payload.assets
        .map((asset) => {
          const candidate = installer(
            sourceId,
            asset,
            `${asset.format}-${asset.arch}`,
          );
          return candidate &&
            candidate.platform === asset.platform &&
            candidate.arch === asset.arch &&
            candidate.format === asset.format
            ? candidate
            : null;
        })
        .filter(Boolean),
    };
  }
  return sourceId === "github"
    ? normalizeGitHubRelease(payload, checkedAt)
    : normalizeCrabNebulaRelease(payload, checkedAt);
}

export function getPlatformAssets(release, platform) {
  const arches =
    platform === "macos"
      ? ["arm64", "universal", "x64", "x86"]
      : ["x64", "arm64", "x86", "universal"];
  const packageFormats =
    platform === "windows"
      ? ["exe", "msi"]
      : platform === "linux"
        ? ["appimage", "deb", "rpm"]
        : ["dmg"];
  const rank = (values, value) =>
    values.indexOf(value) < 0 ? values.length : values.indexOf(value);
  return (release?.assets ?? [])
    .filter((asset) => asset.platform === platform)
    .sort(
      (left, right) =>
        rank(arches, left.arch) - rank(arches, right.arch) ||
        rank(packageFormats, left.format) - rank(packageFormats, right.format),
    );
}

export async function readLimitedText(response, maxBytes = 2 * 1024 * 1024) {
  if (Number(response.headers.get("content-length")) > maxBytes) {
    throw new Error("Release metadata exceeds the size limit.");
  }
  if (!response.body?.getReader) {
    const text = await response.text();
    if (new TextEncoder().encode(text).length > maxBytes) {
      throw new Error("Release metadata exceeds the size limit.");
    }
    return text;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        throw new Error("Release metadata exceeds the size limit.");
      }
      text += decoder.decode(value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

export async function fetchRelease(sourceId, options = {}) {
  const source = RELEASE_SOURCES[sourceId];
  if (!source) throw new Error("Unknown release source.");
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 10000,
  );
  const forwardAbort = () => controller.abort(options.signal?.reason);
  if (options.signal?.aborted) forwardAbort();
  options.signal?.addEventListener("abort", forwardAbort, { once: true });
  try {
    const response = await (options.fetchImpl ?? fetch)(
      options.endpoint ?? source.metadataUrl,
      {
        signal: controller.signal,
        cache: "no-store",
        headers: { Accept: "application/json" },
      },
    );
    if (!response.ok)
      throw new Error(
        `${source.name} metadata returned HTTP ${response.status}.`,
      );
    const payload = JSON.parse(await readLimitedText(response));
    return normalizeRelease(sourceId, payload);
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener("abort", forwardAbort);
  }
}
