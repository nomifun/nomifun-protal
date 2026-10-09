import { normalizeRelease } from "./downloads.mjs";

const keyFor = (asset) => [asset.platform, asset.arch, asset.format].join(":");
const timestamp = (value) =>
  Number.isFinite(Date.parse(value)) ? Date.parse(value) : 0;
const uniqueVersions = (versions) =>
  [
    ...new Set(
      versions
        .filter(
          (value) =>
            typeof value === "string" && value.trim() && value.length <= 100,
        )
        .map((value) => value.replace(/^v(?=\d)/, "")),
    ),
  ].slice(0, 200);

// A source's newest release is metadata, while each installer keeps the
// version of the release that actually published that OS/CPU/package.
export function buildDownloadCatalog(
  releases,
  {
    historyComplete = false,
    partial = false,
    knownVersions = [],
    latestRelease = null,
  } = {},
) {
  if (!releases.length) throw new Error("No verified release is available.");
  const ordered = [...releases].sort(
    (a, b) => timestamp(b.publishedAt) - timestamp(a.publishedAt),
  );
  const latest = latestRelease ?? ordered[0];
  const selected = new Map();
  for (const release of ordered) {
    for (const asset of release.assets) {
      const key = keyFor(asset);
      if (!selected.has(key))
        selected.set(key, {
          ...asset,
          version: asset.version ?? release.version,
          publishedAt: asset.publishedAt ?? release.publishedAt,
          releaseUrl: asset.releaseUrl ?? release.releaseUrl,
          checkedAt: asset.checkedAt ?? release.checkedAt,
          retained: false,
        });
    }
  }
  return {
    ...latest,
    assets: [...selected.values()],
    historyComplete,
    partial,
    latestResolved: latestRelease !== null,
    knownVersions: uniqueVersions([
      ...releases.map((release) => release.version),
      ...knownVersions,
    ]),
  };
}

function previousIsNewer(previous, candidate) {
  const oldTime = timestamp(previous.publishedAt),
    newTime = timestamp(candidate.publishedAt);
  if (oldTime && newTime && oldTime !== newTime) return oldTime > newTime;
  const oldVersion = previous.version
    .match(/^(\d+)\.(\d+)\.(\d+)(?:\+.*)?$/)
    ?.slice(1)
    .map(Number);
  const newVersion = candidate.version
    .match(/^(\d+)\.(\d+)\.(\d+)(?:\+.*)?$/)
    ?.slice(1)
    .map(Number);
  if (oldVersion && newVersion) {
    for (let index = 0; index < 3; index++)
      if (oldVersion[index] !== newVersion[index])
        return oldVersion[index] > newVersion[index];
  }
  return false;
}

// A bounded or interrupted history lookup must never delete an independently
// released platform. Retained packages keep their original check time.
export function mergeDownloadCatalog(sourceId, previous, incoming) {
  const current = normalizeRelease(sourceId, incoming);
  const prior = previous ? normalizeRelease(sourceId, previous) : null;
  const assets = new Map(current.assets.map((asset) => [keyFor(asset), asset]));
  for (const asset of prior?.assets ?? []) {
    const found = assets.get(keyFor(asset));
    if (!found || previousIsNewer(asset, found))
      assets.set(keyFor(asset), { ...asset, retained: true });
    else if (found.url === asset.url && !found.size && asset.size)
      assets.set(keyFor(asset), { ...found, size: asset.size });
  }
  const envelope =
    prior && current.latestResolved === false && previousIsNewer(prior, current)
      ? {
          ...current,
          version: prior.version,
          publishedAt: prior.publishedAt,
          releaseUrl: prior.releaseUrl,
          checkedAt: prior.checkedAt,
          partial: true,
        }
      : current;
  return {
    ...envelope,
    historyComplete: current.historyComplete === true,
    partial: envelope.partial === true,
    knownVersions: uniqueVersions([
      ...(current.knownVersions ?? [current.version]),
      ...(prior?.knownVersions ?? (prior ? [prior.version] : [])),
      ...(prior?.assets.map((asset) => asset.version) ?? []),
    ]),
    assets: [...assets.values()],
  };
}
