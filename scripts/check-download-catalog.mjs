import assert from "node:assert/strict";
import {
  buildDownloadCatalog,
  mergeDownloadCatalog,
} from "../lib/download-catalog.mjs";
import {
  normalizeCrabNebulaRelease,
  normalizeGitHubRelease,
  normalizeRelease,
} from "../lib/downloads.mjs";
import {
  getInstallerChoices,
  selectInstaller,
} from "../lib/download-selection.mjs";

const repository = "https://github.com/nomifun/nomifun-desktop";
const oldPublishedAt = "2026-10-01T08:00:00.000Z";
const newPublishedAt = "2026-10-09T08:00:00.000Z";
const oldCheckedAt = "2026-10-09T08:01:00.000Z";
const newCheckedAt = "2026-10-09T08:02:00.000Z";
const laterCheckedAt = "2026-10-09T08:03:00.000Z";
let nextId = 100;

function release(sourceId, version, publishedAt, checkedAt, filenames) {
  const assets = filenames.map((name) => {
    const id = nextId++;
    return sourceId === "github"
      ? {
          id,
          name,
          browser_download_url: `${repository}/releases/download/v${version}/${name}`,
          state: "uploaded",
          size: 2048,
        }
      : {
          assetId: `01M4FP67BB5JAMFXNWP3JC${String(id).padStart(4, "0")}`,
          assetFilename: name,
          assetSize: "2048",
        };
  });
  return sourceId === "github"
    ? normalizeGitHubRelease(
        { tag_name: `v${version}`, published_at: publishedAt, assets },
        checkedAt,
      )
    : normalizeCrabNebulaRelease(
        { status: "Published", version, pubDate: publishedAt, assets },
        checkedAt,
      );
}

const installer = (catalog, platform, arch = "x64", format = "exe") =>
  catalog.assets.find(
    (asset) =>
      asset.platform === platform &&
      asset.arch === arch &&
      asset.format === format,
  );

const completeCatalog = (releases, options = {}) =>
  buildDownloadCatalog(releases, { historyComplete: true, ...options });

for (const sourceId of ["github", "crabnebula"]) {
  const previousRelease = release(
    sourceId,
    "1.2.2",
    oldPublishedAt,
    oldCheckedAt,
    [
      "NomiFun_1.2.2_x64-setup.exe",
      "NomiFun_1.2.2_arm64.msi",
      "NomiFun_1.2.2_aarch64.dmg",
      "NomiFun_1.2.2_x64.dmg",
      "nomifun_1.2.2_amd64.deb",
      "NomiFun_1.2.2_x86_64.AppImage",
    ],
  );
  const macOnly = release(sourceId, "1.2.3", newPublishedAt, newCheckedAt, [
    "NomiFun_1.2.3_aarch64.dmg",
  ]);
  for (const asset of previousRelease.assets) {
    assert.equal(asset.version, "1.2.2");
    assert.equal(asset.publishedAt, oldPublishedAt);
    assert.equal(asset.checkedAt, oldCheckedAt);
    assert.equal(asset.releaseUrl, previousRelease.releaseUrl);
    assert.equal(asset.retained, false);
  }

  const fromHistory = completeCatalog([macOnly, previousRelease]);
  assert.equal(fromHistory.version, "1.2.3");
  assert.equal(fromHistory.assets.length, 6);
  assert.equal(
    installer(fromHistory, "macos", "arm64", "dmg").version,
    "1.2.3",
  );
  assert.equal(installer(fromHistory, "macos", "x64", "dmg").version, "1.2.2");
  assert.equal(installer(fromHistory, "windows").version, "1.2.2");
  assert.equal(installer(fromHistory, "linux", "x64", "deb").version, "1.2.2");
  assert.equal(
    installer(fromHistory, "linux", "x64", "appimage").version,
    "1.2.2",
  );
  assert.equal(
    installer(fromHistory, "windows", "arm64", "msi").version,
    "1.2.2",
  );
  assert.ok(fromHistory.assets.every((asset) => !asset.retained));
  assert.deepEqual(fromHistory.knownVersions, ["1.2.3", "1.2.2"]);
  const unordered = completeCatalog([previousRelease, macOnly]);
  assert.deepEqual(
    unordered.assets,
    fromHistory.assets,
    `${sourceId}: the catalog and package versions must use publication time, even when history is unordered`,
  );
  assert.equal(unordered.version, fromHistory.version);
  assert.equal(unordered.publishedAt, fromHistory.publishedAt);
  assert.equal(unordered.releaseUrl, fromHistory.releaseUrl);
  assert.equal(unordered.checkedAt, fromHistory.checkedAt);
  assert.equal(unordered.latestResolved, false);

  const explicitOfficialLatest = completeCatalog([macOnly, previousRelease], {
    latestRelease: previousRelease,
  });
  assert.equal(explicitOfficialLatest.version, "1.2.2");
  assert.equal(explicitOfficialLatest.publishedAt, oldPublishedAt);
  assert.equal(explicitOfficialLatest.checkedAt, oldCheckedAt);
  assert.equal(explicitOfficialLatest.latestResolved, true);
  assert.equal(
    installer(explicitOfficialLatest, "macos", "arm64", "dmg").version,
    "1.2.3",
    `${sourceId}: an explicitly identified official latest release controls source metadata while package selection remains independent`,
  );
  assert.deepEqual(
    normalizeRelease(sourceId, explicitOfficialLatest),
    explicitOfficialLatest,
    `${sourceId}: proxy normalization must preserve whether the official latest endpoint resolved`,
  );
  const officialRollback = mergeDownloadCatalog(
    sourceId,
    fromHistory,
    completeCatalog([previousRelease], { latestRelease: previousRelease }),
  );
  assert.equal(officialRollback.version, "1.2.2");
  assert.equal(officialRollback.publishedAt, oldPublishedAt);
  assert.equal(officialRollback.releaseUrl, previousRelease.releaseUrl);
  assert.equal(officialRollback.checkedAt, oldCheckedAt);
  assert.equal(officialRollback.latestResolved, true);
  assert.equal(officialRollback.partial, false);
  assert.deepEqual(
    installer(officialRollback, "macos", "arm64", "dmg"),
    { ...installer(fromHistory, "macos", "arm64", "dmg"), retained: true },
    `${sourceId}: official latest metadata may move backward while the independently available installer remains protected from downgrade`,
  );
  assert.deepEqual(
    normalizeRelease(sourceId, fromHistory, laterCheckedAt),
    fromHistory,
    `${sourceId}: the proxy/export normalizer must preserve each package's own release and check time`,
  );

  const previousCatalog = completeCatalog([previousRelease]);
  const partialCatalog = buildDownloadCatalog([macOnly], { partial: true });
  const retained = mergeDownloadCatalog(
    sourceId,
    previousCatalog,
    partialCatalog,
  );
  assert.equal(retained.partial, true);
  assert.equal(retained.historyComplete, false);
  assert.equal(retained.checkedAt, newCheckedAt);
  assert.equal(retained.assets.length, 6);
  assert.equal(installer(retained, "macos", "arm64", "dmg").retained, false);
  for (const key of [
    ["windows", "x64", "exe"],
    ["windows", "arm64", "msi"],
    ["macos", "x64", "dmg"],
    ["linux", "x64", "deb"],
    ["linux", "x64", "appimage"],
  ]) {
    const before = installer(previousCatalog, ...key);
    const after = installer(retained, ...key);
    assert.deepEqual(
      after,
      { ...before, retained: true },
      `${sourceId}: a Mac-only release must retain the prior ${key.join("/")} package, URL, version and original check time`,
    );
  }
  assert.deepEqual(
    normalizeRelease(sourceId, retained, laterCheckedAt),
    retained,
    `${sourceId}: retrieving cached metadata must not make retained packages look freshly checked`,
  );

  const backfill = release(sourceId, "1.2.3", newPublishedAt, laterCheckedAt, [
    "NomiFun_1.2.3_aarch64.dmg",
    "NomiFun_1.2.3_x64-setup.exe",
  ]);
  const refreshed = mergeDownloadCatalog(
    sourceId,
    retained,
    completeCatalog([backfill, previousRelease]),
  );
  assert.equal(installer(refreshed, "windows").version, "1.2.3");
  assert.equal(installer(refreshed, "windows").retained, false);
  assert.equal(installer(refreshed, "windows").checkedAt, laterCheckedAt);
  assert.equal(
    installer(refreshed, "windows").id,
    installer(backfill, "windows").id,
  );
  assert.equal(installer(refreshed, "linux", "x64", "deb").version, "1.2.2");
  assert.equal(installer(refreshed, "linux", "x64", "deb").retained, false);

  const reuploaded = release(
    sourceId,
    "1.2.3",
    newPublishedAt,
    laterCheckedAt,
    ["NomiFun_1.2.3_aarch64.dmg"],
  );
  const replacement = mergeDownloadCatalog(
    sourceId,
    fromHistory,
    completeCatalog([reuploaded, previousRelease]),
  );
  assert.notEqual(
    installer(replacement, "macos", "arm64", "dmg").id,
    installer(fromHistory, "macos", "arm64", "dmg").id,
  );
  assert.equal(
    installer(replacement, "macos", "arm64", "dmg").id,
    reuploaded.assets[0].id,
    `${sourceId}: reuploading the same version must replace the old attachment ID`,
  );
  assert.equal(installer(replacement, "macos", "arm64", "dmg").retained, false);

  const olderCandidate = mergeDownloadCatalog(sourceId, fromHistory, {
    ...previousRelease,
    latestResolved: false,
  });
  assert.deepEqual(
    installer(olderCandidate, "macos", "arm64", "dmg"),
    { ...installer(fromHistory, "macos", "arm64", "dmg"), retained: true },
    `${sourceId}: incomplete or stale history must never replace a newer package with an older release`,
  );
  assert.equal(olderCandidate.version, fromHistory.version);
  assert.equal(olderCandidate.publishedAt, fromHistory.publishedAt);
  assert.equal(olderCandidate.releaseUrl, fromHistory.releaseUrl);
  assert.equal(olderCandidate.checkedAt, fromHistory.checkedAt);
  assert.equal(olderCandidate.latestResolved, false);
  assert.equal(
    olderCandidate.partial,
    true,
    `${sourceId}: a stale source lookup must retain the latest verified release envelope and mark the result partial`,
  );

  const unchangedUrlsWithoutSize = {
    ...fromHistory,
    checkedAt: laterCheckedAt,
    assets: fromHistory.assets.map((asset) => ({
      ...asset,
      size: null,
      checkedAt: laterCheckedAt,
    })),
  };
  const sizesPreserved = mergeDownloadCatalog(
    sourceId,
    fromHistory,
    unchangedUrlsWithoutSize,
  );
  assert.ok(
    sizesPreserved.assets.every((asset) => asset.size === 2048),
    `${sourceId}: a metadata response that omits size must retain the known size only for the same immutable asset URL`,
  );
  assert.ok(
    sizesPreserved.assets.every((asset) => asset.checkedAt === laterCheckedAt),
  );
  const changedUrlWithoutSize = release(
    sourceId,
    "1.2.4",
    "2026-10-09T09:00:00.000Z",
    laterCheckedAt,
    ["NomiFun_1.2.4_aarch64.dmg"],
  );
  changedUrlWithoutSize.assets[0].size = null;
  const sizeUnknown = mergeDownloadCatalog(
    sourceId,
    fromHistory,
    completeCatalog([changedUrlWithoutSize]),
  );
  assert.equal(
    installer(sizeUnknown, "macos", "arm64", "dmg").size,
    null,
    `${sourceId}: a different package URL must not inherit a previous file's size`,
  );
  const datesUnavailable = mergeDownloadCatalog(
    sourceId,
    {
      ...fromHistory,
      assets: fromHistory.assets.map((asset) => ({
        ...asset,
        publishedAt: null,
      })),
    },
    {
      ...completeCatalog([previousRelease]),
      publishedAt: null,
      assets: previousRelease.assets.map((asset) => ({
        ...asset,
        publishedAt: null,
      })),
    },
  );
  assert.equal(
    installer(datesUnavailable, "macos", "arm64", "dmg").version,
    "1.2.3",
    `${sourceId}: stable semantic version order must guard against downgrade when upstream publication dates are missing`,
  );

  const invalidUrl = {
    ...fromHistory.assets[0],
    url: "https://evil.example/package.dmg",
  };
  const otherSourceUrl = {
    ...fromHistory.assets[0],
    url:
      sourceId === "github"
        ? "https://cdn.crabnebula.app/asset/01M4FP67BB5JAMFXNWP3JCY0K4"
        : `${repository}/releases/download/v1.2.3/NomiFun_1.2.3_aarch64.dmg`,
  };
  const normalized = normalizeRelease(sourceId, {
    ...fromHistory,
    releaseUrl: "https://evil.example/release",
    assets: [
      { ...fromHistory.assets[0], releaseUrl: "https://evil.example/release" },
      invalidUrl,
      otherSourceUrl,
    ],
  });
  assert.equal(normalized.assets.length, 1);
  assert.equal(normalized.assets[0].version, "1.2.3");
  assert.ok(!normalized.assets[0].releaseUrl.includes("evil.example"));
  assert.ok(!normalized.releaseUrl.includes("evil.example"));

  const versions = completeCatalog([macOnly], {
    knownVersions: [
      "v1.2.3",
      "1.2.2",
      "v1.2.2",
      "",
      " ",
      null,
      "x".repeat(101),
      ...Array.from({ length: 250 }, (_, index) => `0.0.${index}`),
    ],
  }).knownVersions;
  assert.equal(versions.length, 200);
  assert.deepEqual(versions.slice(0, 3), ["1.2.3", "1.2.2", "0.0.0"]);
  assert.ok(
    versions.every((version) => typeof version === "string" && version.trim()),
  );
  assert.equal(new Set(versions).size, versions.length);
  assert.equal(
    normalizeRelease(sourceId, {
      ...fromHistory,
      knownVersions: [...versions, "9.9.9"],
    }).knownVersions.length,
    200,
    `${sourceId}: proxy metadata and history candidates must keep the same bounded version list`,
  );
  assert.throws(() => buildDownloadCatalog([]), /No verified release/);
}

const githubCatalog = completeCatalog([
  release("github", "1.2.4", newPublishedAt, newCheckedAt, [
    "NomiFun_1.2.4_x64-setup.exe",
  ]),
]);
const crabnebulaCatalog = completeCatalog([
  release("crabnebula", "1.2.3", oldPublishedAt, oldCheckedAt, [
    "NomiFun_1.2.3_x64-setup.exe",
  ]),
]);
const catalogs = { github: githubCatalog, crabnebula: crabnebulaCatalog };
const choice = getInstallerChoices(catalogs, "windows")[0];
assert.deepEqual(choice, { arch: "x64", format: "exe" });
assert.equal(selectInstaller(catalogs.github.assets, choice).version, "1.2.4");
assert.equal(
  selectInstaller(catalogs.crabnebula.assets, choice).version,
  "1.2.3",
);
const githubOnly = mergeDownloadCatalog(
  "github",
  crabnebulaCatalog,
  githubCatalog,
);
assert.equal(githubOnly.assets.length, 1);
assert.ok(
  githubOnly.assets.every((asset) =>
    asset.url.startsWith(`${repository}/releases/download/`),
  ),
);
assert.equal(githubOnly.assets[0].retained, false);
const crabnebulaOnly = mergeDownloadCatalog(
  "crabnebula",
  githubCatalog,
  crabnebulaCatalog,
);
assert.equal(crabnebulaOnly.assets.length, 1);
assert.ok(
  crabnebulaOnly.assets.every((asset) =>
    asset.url.startsWith("https://cdn.crabnebula.app/asset/"),
  ),
);
assert.equal(crabnebulaOnly.assets[0].retained, false);

console.log(
  "Download catalog checks passed: independent OS/CPU/package versions, Mac-only release retention, historical package discovery, reuploads and backfills, downgrade prevention, original timestamps, partial-history flags, bounded version candidates, proxy provenance and source isolation.",
);
