import fs from "node:fs/promises";
import { RELEASE_SOURCES } from "../lib/downloads.mjs";
import { mergeDownloadCatalog } from "../lib/download-catalog.mjs";
import { fetchReleaseHistory } from "../lib/release-history.mjs";

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
    const candidateVersions = [
      ...new Set(
        Object.values(snapshot)
          .flatMap((release) => [
            release.version,
            ...(release.knownVersions ?? []),
            ...(release.assets ?? []).map((asset) => asset.version),
          ])
          .filter(Boolean),
      ),
    ];
    const incoming = await fetchReleaseHistory(sourceId, {
      signal,
      seed: snapshot[sourceId],
      candidateVersions,
    });
    return [
      sourceId,
      mergeDownloadCatalog(sourceId, snapshot[sourceId], incoming),
    ];
  }),
);

let failedWithoutSnapshot = false;
for (const [index, result] of results.entries()) {
  const sourceId = Object.keys(RELEASE_SOURCES)[index];
  if (result.status === "fulfilled") {
    const [, release] = result.value;
    snapshot[sourceId] = release;
    console.log(
      `${RELEASE_SOURCES[sourceId].name}: latest ${release.version}, ${release.assets.length} current platform installers${release.partial ? ", some history requests failed" : ""}${release.historyComplete ? "" : ", bounded history coverage"}.`,
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
