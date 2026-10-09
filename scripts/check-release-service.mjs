import assert from "node:assert/strict";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  createReleaseService,
  RELEASE_CACHE_MS,
} from "../lib/release-service.mjs";
import { RELEASE_SOURCES, isTrustedDownloadUrl } from "../lib/downloads.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const snapshot = JSON.parse(
  await fs.readFile(path.join(root, "lib/releases-snapshot.json"), "utf8"),
);

async function withServer(handler, run) {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    await run((query, options) =>
      fetch(`${base}/api/releases${query}`, options),
    );
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

let time = 1_000;
const calls = { github: 0, crabnebula: 0 };
let failGithub = false;
let releaseFirst;
const firstResponse = new Promise((resolve) => {
  releaseFirst = resolve;
});
const handler = createReleaseService({
  now: () => time,
  fetchImpl: async (url) => {
    if (url === RELEASE_SOURCES.github.releaseUrl)
      return new Response("unavailable", { status: 503 });
    const source = Object.keys(RELEASE_SOURCES).find(
      (id) => RELEASE_SOURCES[id].metadataUrl === url,
    );
    assert.ok(
      source,
      "the service must only request a fixed known upstream URL",
    );
    calls[source] += 1;
    if (source === "github" && calls.github === 1) await firstResponse;
    if (source === "github" && failGithub)
      return new Response("rate limited", { status: 403 });
    return Response.json(snapshot[source]);
  },
});

await withServer(handler, async (request) => {
  for (const query of [
    "",
    "?source=unknown",
    "?source=constructor",
    "?source=github&source=crabnebula",
    "?source=github&url=https://example.com",
  ]) {
    const response = await request(query);
    assert.equal(response.status, 400, query);
    assert.equal(response.headers.get("cache-control"), "no-store");
  }
  const post = await request("?source=github", { method: "POST" });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get("allow"), "GET");
  assert.deepEqual(calls, { github: 0, crabnebula: 0 });

  const concurrent = Array.from({ length: 8 }, () => request("?source=github"));
  // Finish only after the handler reaches the fixed upstream; all callers wait
  // on that shared refresh rather than creating eight upstream requests.
  while (!calls.github) await new Promise((resolve) => setTimeout(resolve, 1));
  releaseFirst();
  const responses = await Promise.all(concurrent);
  assert.equal(calls.github, 1);
  for (const response of responses) {
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), snapshot.github);
  }
  const crabnebula = await request("?source=crabnebula");
  assert.deepEqual(await crabnebula.json(), snapshot.crabnebula);
  assert.equal(calls.crabnebula, 1);

  time += 30_000;
  const cached = await request("?source=github");
  assert.equal(calls.github, 1);
  assert.match(cached.headers.get("cache-control"), /s-maxage=30,/);
  assert.equal((await cached.json()).checkedAt, snapshot.github.checkedAt);

  time += RELEASE_CACHE_MS;
  failGithub = true;
  const failed = await request("?source=github");
  assert.equal(failed.status, 503);
  assert.equal(failed.headers.get("cache-control"), "no-store");
  assert.deepEqual(await failed.json(), {
    error: "release_unavailable",
    source: "github",
    stale: true,
    checkedAt: snapshot.github.checkedAt,
  });
  const independent = await request("?source=crabnebula");
  assert.equal(independent.status, 200);
  assert.equal((await independent.json()).version, snapshot.crabnebula.version);
  assert.equal(calls.crabnebula, 2);

  failGithub = false;
  const recovered = await request("?source=github");
  assert.equal(recovered.status, 200);
  assert.equal(calls.github, 3);
});

await withServer(
  createReleaseService({
    timeoutMs: 15,
    fetchImpl: (_url, { signal }) =>
      new Promise((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(new Error("timeout")), {
          once: true,
        });
      }),
  }),
  async (request) => {
    const response = await request("?source=crabnebula");
    assert.equal(response.status, 503);
    assert.equal((await response.json()).checkedAt, null);
  },
);

const fallbackRequests = [];
await withServer(
  createReleaseService({
    fetchImpl: async (url) => {
      fallbackRequests.push(url);
      if (url === RELEASE_SOURCES.github.metadataUrl)
        return new Response("rate limited", { status: 403 });
      if (url === RELEASE_SOURCES.github.releaseUrl) {
        const page = new Response(
          `<relative-time datetime="${snapshot.github.publishedAt}"></relative-time>`,
        );
        Object.defineProperty(page, "url", {
          value: snapshot.github.releaseUrl,
        });
        return page;
      }
      assert.equal(
        url,
        `https://github.com/nomifun/nomifun-desktop/releases/expanded_assets/v${snapshot.github.version}`,
      );
      return new Response(
        snapshot.github.assets
          .map(
            (asset) => `<a href="${new URL(asset.url).pathname}">package</a>`,
          )
          .join("\n"),
      );
    },
  }),
  async (request) => {
    const response = await request("?source=github");
    assert.equal(response.status, 200);
    const release = await response.json();
    assert.equal(release.version, snapshot.github.version);
    assert.deepEqual(
      release.assets.map((asset) => asset.url),
      snapshot.github.assets.map((asset) => asset.url),
    );
    assert.equal(
      fallbackRequests.length,
      3,
      "API limit must recover through the same repository's tagged release assets",
    );
  },
);

await withServer(
  createReleaseService({
    timeoutMs: 20,
    fetchImpl: async (url, { signal }) => {
      if (url === RELEASE_SOURCES.github.metadataUrl)
        return new Response("rate limited", { status: 403 });
      assert.equal(url, RELEASE_SOURCES.github.releaseUrl);
      return new Promise((_resolve, reject) => {
        signal.addEventListener(
          "abort",
          () => reject(new Error("fallback timeout")),
          { once: true },
        );
      });
    },
  }),
  async (request) => {
    assert.equal((await request("?source=github")).status, 503);
  },
);

if (process.argv.includes("--packaged")) {
  const output = path.join(root, ".vercel/output");
  const config = JSON.parse(
    await fs.readFile(path.join(output, "config.json"), "utf8"),
  );
  const functionDir = path.join(output, "functions/api/releases.func");
  const functionConfig = JSON.parse(
    await fs.readFile(path.join(functionDir, ".vc-config.json"), "utf8"),
  );
  assert.equal(config.version, 3);
  assert.equal(functionConfig.runtime, "nodejs22.x");
  assert.equal(functionConfig.launcherType, "Nodejs");
  assert.ok(functionConfig.maxDuration > 10);
  assert.ok(config.routes.some((route) => route.dest === "/api/releases"));
  for (const page of [
    "/",
    "/zh",
    "/en",
    "/zh/download",
    "/en/products/desktop",
    "/products/mobile",
  ]) {
    const route = config.routes.find(
      (candidate) => candidate.dest && new RegExp(candidate.src).test(page),
    );
    assert.ok(
      route?.dest.endsWith(".html"),
      `${page} must resolve to a static HTML page`,
    );
    assert.ok(
      (await fs.readFile(path.join(output, "static", route.dest))).equals(
        await fs.readFile(path.join(root, "out", route.dest)),
      ),
      `${page} must preserve the Next export; rerun packaging after the latest build`,
    );
  }
  const packaged = await import(
    pathToFileURL(path.join(functionDir, functionConfig.handler))
  );
  await withServer(packaged.default, async (request) => {
    assert.equal((await request("?source=invalid")).status, 400);
    if (process.argv.includes("--live")) {
      for (const source of ["github", "crabnebula"]) {
        const response = await request(`?source=${source}`);
        assert.equal(response.status, 200, `${source} live packaged handler`);
        const release = await response.json();
        assert.ok(release.version && release.checkedAt);
        assert.ok(release.assets.length);
        for (const asset of release.assets)
          assert.ok(isTrustedDownloadUrl(source, asset.url));
        console.log(
          `Packaged live ${source}: v${release.version}, ${release.assets.length} installers, checked ${release.checkedAt}.`,
        );
      }
    }
  });
}

console.log(
  "Release service checks passed: fixed upstreams, independent caches, concurrent refresh, bounded cache freshness, query/method validation, explicit failure, shared timeout, GitHub rate-limit fallback and recovery.",
);
