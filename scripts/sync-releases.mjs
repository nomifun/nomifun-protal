import fs from "node:fs/promises";
import { RELEASE_SOURCES, fetchRelease } from "../lib/downloads.mjs";
import { fetchGitHubHtmlRelease } from "../lib/github-release-html.mjs";

const snapshotPath = new URL("../lib/releases-snapshot.json", import.meta.url);
const manifestPath = new URL("../public/release-metadata/", import.meta.url);

let snapshot = {};
try {
  snapshot = JSON.parse(await fs.readFile(snapshotPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const results = await Promise.allSettled(
  Object.keys(RELEASE_SOURCES).map(async (sourceId) => {
    const signal = AbortSignal.timeout(10000);
    try {
      return [sourceId, await fetchRelease(sourceId, { signal })];
    } catch (error) {
      if (sourceId !== "github") throw error;
      console.warn(`${error.message} Trying the public GitHub release page.`);
      return [sourceId, await fetchGitHubHtmlRelease({ signal })];
    }
  }),
);

let failedWithoutSnapshot = false;
for (const [index, result] of results.entries()) {
  const sourceId = Object.keys(RELEASE_SOURCES)[index];
  if (result.status === "fulfilled") {
    const [, release] = result.value;
    // A size independently verified for an immutable asset can be retained
    // when the metadata endpoint omits it. New asset URLs remain unknown.
    const knownSizes = new Map(
      (snapshot[sourceId]?.assets ?? []).map((asset) => [
        asset.url,
        asset.size,
      ]),
    );
    release.assets = release.assets.map((asset) => ({
      ...asset,
      size: asset.size ?? knownSizes.get(asset.url) ?? null,
    }));
    snapshot[sourceId] = release;
    console.log(
      `${RELEASE_SOURCES[sourceId].name}: ${release.version}, ${release.assets.length} installers.`,
    );
  } else if (snapshot[sourceId]?.checkedAt) {
    console.warn(
      `${RELEASE_SOURCES[sourceId].name}: ${result.reason.message} Keeping snapshot checked at ${snapshot[sourceId].checkedAt}.`,
    );
  } else {
    failedWithoutSnapshot = true;
    console.error(
      `${RELEASE_SOURCES[sourceId].name}: ${result.reason.message} No verified snapshot is available.`,
    );
  }
}

if (failedWithoutSnapshot) process.exitCode = 1;
else {
  await fs.mkdir(manifestPath, { recursive: true });
  await fs.writeFile(snapshotPath, JSON.stringify(snapshot, null, 2) + "\n");
  await Promise.all(
    Object.keys(RELEASE_SOURCES).map((sourceId) =>
      fs.writeFile(
        new URL(`${sourceId}.json`, manifestPath),
        JSON.stringify(snapshot[sourceId], null, 2) + "\n",
      ),
    ),
  );
}
