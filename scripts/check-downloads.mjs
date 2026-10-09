import assert from "node:assert/strict";
import fs from "node:fs/promises";
import {
  classifyInstaller,
  fetchRelease,
  getPlatformAssets,
  isTrustedDownloadUrl,
  normalizeCrabNebulaRelease,
  normalizeGitHubRelease,
  normalizeRelease,
  readLimitedText,
} from "../lib/downloads.mjs";
import { fetchGitHubHtmlRelease } from "../lib/github-release-html.mjs";

const checkedAt = "2026-10-09T00:00:00.000Z";
const githubUrl =
  "https://github.com/nomifun/nomifun-desktop/releases/download/v1.2.3/";
for (const [name, hint, expected] of [
  [
    "NomiFun_1.2.3_x64-setup.exe",
    "",
    { platform: "windows", arch: "x64", format: "exe" },
  ],
  [
    "NomiFun_1.2.3_arm64.msi",
    "",
    { platform: "windows", arch: "arm64", format: "msi" },
  ],
  [
    "NomiFun_1.2.3_aarch64.dmg",
    "",
    { platform: "macos", arch: "arm64", format: "dmg" },
  ],
  [
    "NomiFun_1.2.3_x64.dmg",
    "",
    { platform: "macos", arch: "x64", format: "dmg" },
  ],
  [
    "NomiFun_1.2.3_universal.dmg",
    "",
    { platform: "macos", arch: "universal", format: "dmg" },
  ],
  [
    "NomiFun.AppImage",
    "appimage-x86_64",
    { platform: "linux", arch: "x64", format: "appimage" },
  ],
  [
    "nomifun_1.2.3_amd64.deb",
    "",
    { platform: "linux", arch: "x64", format: "deb" },
  ],
  [
    "nomifun-1.2.3.aarch64.rpm",
    "",
    { platform: "linux", arch: "arm64", format: "rpm" },
  ],
  [
    "NomiFun_1.2.3_i686-setup.exe",
    "",
    { platform: "windows", arch: "x86", format: "exe" },
  ],
  ["NomiFun.app.tar.gz", "darwin-aarch64", null],
  ["NomiFun_1.2.3_x64.dmg.sig", "", null],
  ["NomiFun_1.2.3_x64.release-lock.json", "", null],
  ["NomiFun_1.2.3_x64.zip", "", null],
  ["NomiFun_1.2.3_armv7.deb", "", null],
  ["NomiFun_1.2.3.dmg", "", null],
  [
    "NomiFun_1.2.3_x64.dmg",
    "dmg-aarch64",
    { platform: "macos", arch: "x64", format: "dmg" },
  ],
])
  assert.deepEqual(classifyInstaller(name, hint), expected, name);

const github = normalizeGitHubRelease(
  {
    tag_name: "v1.2.3",
    published_at: checkedAt,
    assets: [
      {
        id: 1,
        name: "NomiFun_1.2.3_aarch64.dmg",
        browser_download_url: `${githubUrl}NomiFun_1.2.3_aarch64.dmg`,
        size: 2048,
      },
      {
        id: 2,
        name: "NomiFun_1.2.3_x64-setup.exe",
        browser_download_url: `${githubUrl}NomiFun_1.2.3_x64-setup.exe`,
        state: "new",
      },
      {
        id: 3,
        name: "NomiFun_1.2.3_x64.dmg",
        browser_download_url: "https://evil.example/package.dmg",
      },
      {
        id: 4,
        name: "NomiFun.app.tar.gz",
        browser_download_url: `${githubUrl}NomiFun.app.tar.gz`,
      },
    ],
  },
  checkedAt,
);
assert.equal(github.version, "1.2.3");
assert.equal(github.assets.length, 1);
assert.equal(github.assets[0].size, 2048);
assert.equal(getPlatformAssets(github, "windows").length, 0);
const orderedAssets = {
  assets: [
    { platform: "macos", arch: "x64", format: "dmg" },
    { platform: "macos", arch: "universal", format: "dmg" },
    { platform: "macos", arch: "arm64", format: "dmg" },
    { platform: "windows", arch: "x86", format: "exe" },
    { platform: "windows", arch: "x64", format: "msi" },
    { platform: "windows", arch: "arm64", format: "exe" },
    { platform: "windows", arch: "x64", format: "exe" },
    { platform: "linux", arch: "arm64", format: "appimage" },
    { platform: "linux", arch: "x64", format: "rpm" },
    { platform: "linux", arch: "x64", format: "deb" },
    { platform: "linux", arch: "x64", format: "appimage" },
    { platform: "linux", arch: "x86", format: "deb" },
    { platform: "linux", arch: "other", format: "deb" },
  ],
};
const originalOrder = [...orderedAssets.assets];
assert.deepEqual(
  getPlatformAssets(orderedAssets, "macos").map((asset) => asset.arch),
  ["arm64", "universal", "x64"],
);
assert.deepEqual(
  getPlatformAssets(orderedAssets, "windows").map(
    (asset) => `${asset.arch}-${asset.format}`,
  ),
  ["x64-exe", "x64-msi", "arm64-exe", "x86-exe"],
);
assert.deepEqual(
  getPlatformAssets(orderedAssets, "linux").map(
    (asset) => `${asset.arch}-${asset.format}`,
  ),
  [
    "x64-appimage",
    "x64-deb",
    "x64-rpm",
    "arm64-appimage",
    "x86-deb",
    "other-deb",
  ],
);
assert.deepEqual(
  orderedAssets.assets,
  originalOrder,
  "sorting must not mutate or drop source assets",
);
assert.throws(() =>
  normalizeGitHubRelease({
    tag_name: "v1.2.3-beta",
    prerelease: true,
    assets: [],
  }),
);
assert.throws(() =>
  normalizeGitHubRelease({ tag_name: "v1.2.3", draft: true, assets: [] }),
);

const crabnebula = normalizeCrabNebulaRelease(
  {
    result: {
      type: "response",
      data: {
        version: "1.2.4",
        status: "Published",
        pubDate: checkedAt,
        assets: [
          {
            assetId: "01M4FP67BB5JAMFXNWP3JCY0K4",
            assetFilename: "NomiFun_1.2.4_aarch64.dmg",
            publicPlatform: "dmg-aarch64",
            assetUrl: "https://evil.example/file",
          },
          {
            assetId: "01M4FNZGNVC261MVK56B1QYH1S",
            assetFilename: "NomiFun.app.tar.gz",
            updatePlatform: "darwin-aarch64",
          },
        ],
      },
    },
  },
  checkedAt,
);
assert.equal(crabnebula.version, "1.2.4");
assert.equal(crabnebula.assets.length, 1);
assert.equal(
  crabnebula.assets[0].url,
  "https://cdn.crabnebula.app/asset/01M4FP67BB5JAMFXNWP3JCY0K4",
);
assert.equal(crabnebula.assets[0].size, null);
const sizedCrabNebula = normalizeCrabNebulaRelease({
  status: "Published",
  version: "1.2.4",
  assets: [
    {
      assetId: "01M4FP67BB5JAMFXNWP3JCY0K4",
      assetFilename: "NomiFun_1.2.4_aarch64.dmg",
      assetSize: "2048",
    },
  ],
});
assert.equal(sizedCrabNebula.assets[0].size, 2048);
assert.throws(() =>
  normalizeCrabNebulaRelease({ status: "Draft", version: "1.2.3", assets: [] }),
);
assert.throws(() =>
  normalizeCrabNebulaRelease({
    status: "Published",
    channel: "beta",
    version: "1.2.3",
    assets: [],
  }),
);
assert.equal(
  isTrustedDownloadUrl(
    "github",
    "https://github.com.evil.example/nomifun/nomifun-desktop/releases/download/v1/a.exe",
  ),
  false,
);
assert.equal(
  isTrustedDownloadUrl(
    "github",
    "https://github.com/other/repository/releases/download/v1/a.exe",
  ),
  false,
);
assert.equal(
  isTrustedDownloadUrl(
    "crabnebula",
    "https://cdn.crabnebula.app/asset/../evil",
  ),
  false,
);
assert.equal(
  normalizeRelease("github", github, "2030-01-01T00:00:00.000Z").checkedAt,
  checkedAt,
);
const unprefixedTag = normalizeGitHubRelease(
  { tag_name: "1.2.3", assets: [] },
  checkedAt,
);
assert.equal(
  normalizeRelease("github", unprefixedTag).releaseUrl,
  unprefixedTag.releaseUrl,
);
const genericFilename = {
  ...crabnebula,
  assets: [{ ...crabnebula.assets[0], name: "NomiFun.dmg" }],
};
assert.deepEqual(
  normalizeRelease("crabnebula", genericFilename),
  genericFilename,
);

const sources = await Promise.allSettled([
  fetchRelease("github", {
    fetchImpl: async () => new Response("rate limited", { status: 403 }),
  }),
  fetchRelease("crabnebula", {
    endpoint: "/release-metadata/crabnebula.json",
    fetchImpl: async (url) => {
      assert.equal(url, "/release-metadata/crabnebula.json");
      return new Response(JSON.stringify(crabnebula));
    },
  }),
]);
assert.equal(sources[0].status, "rejected");
assert.equal(sources[1].status, "fulfilled");
assert.equal(sources[1].value.checkedAt, checkedAt);
await assert.rejects(readLimitedText(new Response("123456"), 5), /size limit/);
await assert.rejects(
  fetchRelease("github", {
    timeoutMs: 10,
    fetchImpl: (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(new Error("aborted")), {
          once: true,
        });
      }),
  }),
  /aborted/,
);

function mockReleasePage(
  body,
  url = "https://github.com/nomifun/nomifun-desktop/releases/tag/v1.2.4",
) {
  const response = new Response(body);
  Object.defineProperty(response, "url", { value: url });
  return response;
}
const htmlDate = `<relative-time datetime="${checkedAt}">`;
const htmlAsset =
  '<a href="/nomifun/nomifun-desktop/releases/download/v1.2.4/NomiFun_1.2.4_aarch64.dmg">';
const htmlRelease = await fetchGitHubHtmlRelease({
  fetchImpl: async (url) =>
    url.endsWith("/latest")
      ? mockReleasePage(htmlDate)
      : new Response(htmlAsset),
});
assert.equal(htmlRelease.version, "1.2.4");
assert.equal(htmlRelease.assets.length, 1);
await assert.rejects(
  fetchGitHubHtmlRelease({
    fetchImpl: async (url) =>
      url.endsWith("/latest")
        ? mockReleasePage(htmlDate)
        : new Response("unavailable", { status: 503 }),
  }),
  /asset list returned HTTP 503/,
);
await assert.rejects(
  fetchGitHubHtmlRelease({
    fetchImpl: async (url) =>
      url.endsWith("/latest")
        ? mockReleasePage(htmlDate)
        : new Response(htmlAsset.replaceAll("v1.2.4", "v1.2.3")),
  }),
  /no readable asset list for the latest tag/,
);
await assert.rejects(
  fetchGitHubHtmlRelease({
    fetchImpl: async () => mockReleasePage("no publish date"),
  }),
  /no readable publish date/,
);
await assert.rejects(
  fetchGitHubHtmlRelease({
    fetchImpl: async () =>
      mockReleasePage(
        htmlDate,
        "https://evil.example/nomifun/nomifun-desktop/releases/tag/v1.2.4",
      ),
  }),
  /did not identify a release tag/,
);

const snapshot = JSON.parse(
  await fs.readFile(
    new URL("../lib/releases-snapshot.json", import.meta.url),
    "utf8",
  ),
);
for (const sourceId of ["github", "crabnebula"]) {
  assert.deepEqual(
    normalizeRelease(sourceId, snapshot[sourceId]),
    snapshot[sourceId],
  );
  assert.ok(
    snapshot[sourceId].checkedAt,
    `${sourceId} must have a real upstream check time`,
  );
}
console.log(
  "Download checks passed: installer classification and ordering, source isolation, pinned URLs, snapshot timestamps, metadata size and timeout bounds, GitHub HTML fallback and latest-tag failure handling.",
);
