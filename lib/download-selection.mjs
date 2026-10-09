import { getPlatformAssets } from "./downloads.mjs";

// A release creates new asset IDs. Keep the user's processor/package choice
// across releases and sources; if it disappears, require an explicit choice.
export function selectInstaller(assets, preference) {
  if (!preference) return assets[0] ?? null;
  return (
    assets.find(
      (asset) =>
        asset.arch === preference.arch && asset.format === preference.format,
    ) ?? null
  );
}

// Both sources share the platform's processor/package choice. Prefer the
// recommended source's available combinations, then include the backup's.
export function getInstallerChoices(releases, platform) {
  const choices = [];
  const seen = new Set();
  for (const sourceId of ["crabnebula", "github"]) {
    for (const { arch, format } of getPlatformAssets(
      releases[sourceId],
      platform,
    )) {
      const key = `${arch}:${format}`;
      if (seen.has(key)) continue;
      seen.add(key);
      choices.push({ arch, format });
    }
  }
  return choices;
}

export function selectInstallerChoice(choices, preference) {
  return selectInstaller(choices, preference);
}
