import assert from "node:assert/strict";
import {
  getInstallerChoices,
  selectInstaller,
  selectInstallerChoice,
} from "../lib/download-selection.mjs";
import { getPlatformAssets } from "../lib/downloads.mjs";

const preference = { arch: "x64", format: "dmg" };
const oldAssets = [
  { id: "old-intel", arch: "x64", format: "dmg", platform: "macos" },
];
const newAssets = [
  { id: "new-arm", arch: "arm64", format: "dmg", platform: "macos" },
  { id: "new-intel", arch: "x64", format: "dmg", platform: "macos" },
];
assert.equal(selectInstaller(oldAssets, preference).id, "old-intel");
assert.equal(
  selectInstaller(newAssets, preference).id,
  "new-intel",
  "A refreshed release must keep the chosen processor despite new asset IDs.",
);

const releases = {
  crabnebula: { assets: newAssets },
  github: {
    assets: [
      { ...newAssets[1], id: "github-intel" },
      {
        id: "github-universal",
        arch: "universal",
        format: "dmg",
        platform: "macos",
      },
      { id: "github-win", arch: "x64", format: "exe", platform: "windows" },
    ],
  },
};
const choices = getInstallerChoices(releases, "macos");
assert.deepEqual(
  choices,
  [
    { arch: "arm64", format: "dmg" },
    { arch: "x64", format: "dmg" },
    { arch: "universal", format: "dmg" },
  ],
  "Choices must combine each source's platform installers, preferring CrabNebula and deduplicating processor/package combinations.",
);
assert.deepEqual(selectInstallerChoice(choices), {
  arch: "arm64",
  format: "dmg",
});
assert.deepEqual(selectInstallerChoice(choices, preference), preference);
assert.equal(
  selectInstaller(getPlatformAssets(releases.crabnebula, "macos"), preference)
    .id,
  "new-intel",
);
assert.equal(
  selectInstaller(getPlatformAssets(releases.github, "macos"), preference).id,
  "github-intel",
  "Both download links must independently resolve the same selected processor/package.",
);

const recommendedMissingProcessor = {
  ...releases,
  crabnebula: { assets: [newAssets[0]] },
};
assert.deepEqual(
  selectInstallerChoice(
    getInstallerChoices(recommendedMissingProcessor, "macos"),
    preference,
  ),
  preference,
  "A processor available from the backup source must remain selectable.",
);
assert.equal(
  selectInstaller(
    getPlatformAssets(recommendedMissingProcessor.crabnebula, "macos"),
    preference,
  ),
  null,
  "A source missing the selected architecture must never silently download another CPU's package.",
);
assert.equal(
  selectInstaller(
    getPlatformAssets(recommendedMissingProcessor.github, "macos"),
    preference,
  ).id,
  "github-intel",
);

assert.deepEqual(
  getInstallerChoices(releases, "windows"),
  [{ arch: "x64", format: "exe" }],
  "A platform absent from the recommended source must use the backup's available installer.",
);
assert.deepEqual(
  selectInstallerChoice(
    getInstallerChoices({ github: releases.github }, "macos"),
  ),
  { arch: "universal", format: "dmg" },
  "If the recommended source has no release, default to the backup's first sorted installer.",
);

assert.deepEqual(
  getInstallerChoices(
    {
      crabnebula: {
        assets: [
          { id: "cn-msi", arch: "x64", format: "msi", platform: "windows" },
          {
            id: "cn-msi-duplicate",
            arch: "x64",
            format: "msi",
            platform: "windows",
          },
        ],
      },
      github: {
        assets: [
          { id: "gh-msi", arch: "x64", format: "msi", platform: "windows" },
          { id: "gh-exe", arch: "x64", format: "exe", platform: "windows" },
        ],
      },
    },
    "windows",
  ),
  [
    { arch: "x64", format: "msi" },
    { arch: "x64", format: "exe" },
  ],
  "Deduplication must retain different package formats and prefer a real recommended-source attachment over a backup-only format.",
);

const removedSelectedProcessor = {
  crabnebula: { assets: [newAssets[0]] },
  github: { assets: [{ ...newAssets[0], id: "github-arm" }] },
};
assert.equal(
  selectInstallerChoice(
    getInstallerChoices(removedSelectedProcessor, "macos"),
    preference,
  ),
  null,
  "If both sources remove the chosen processor/package, an explicit reselection is required.",
);
assert.equal(selectInstaller([], preference), null);
assert.equal(selectInstallerChoice([], preference), null);
assert.equal(selectInstallerChoice([]), null);
assert.deepEqual(getInstallerChoices({}, "macos"), []);

console.log(
  "Download selection checks passed: platform choices combine both sources, preserve processor/package preferences, and require reselection when removed.",
);
