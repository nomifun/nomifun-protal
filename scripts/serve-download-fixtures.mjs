// Local simulations only. URLs have official shapes but refer to synthetic
// releases; do not click download buttons or fetch these binaries during QA.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const portIndex = process.argv.indexOf("--port");
const port = Number(portIndex < 0 ? 3109 : process.argv[portIndex + 1]);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("--port must be an integer between 1 and 65535.");
const root = path.resolve("out");
if (!fs.existsSync(path.join(root, "download.html")))
  throw new Error("Run npm run build before starting the fixture preview.");
const counts = { crabnebula: 0, github: 0 };
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

function fixture(source, attempt) {
  const cn = source === "crabnebula";
  const version = cn ? (attempt === 1 ? "8.3.0" : "8.5.0") : "8.4.0";
  const arch = cn ? "arm64" : "x64";
  const name = `NomiFun_${version}_${cn ? "aarch64" : "x64"}.dmg`;
  const id = cn
    ? attempt === 1
      ? "01M4FP67BB5JAMFXNWP3JCY0K5"
      : "01M4FP67BB5JAMFXNWP3JCY0K6"
    : name;
  return {
    fixture: "LOCAL SIMULATION — never download these synthetic assets",
    version,
    publishedAt: "2026-10-09T08:00:00.000Z",
    checkedAt: new Date().toISOString(),
    releaseUrl: cn
      ? "https://crabnebula.cloud/nomifun/nomifun-desktop/releases"
      : `https://github.com/nomifun/nomifun-desktop/releases/tag/v${version}`,
    assets: [
      {
        id,
        name,
        url: cn
          ? `https://cdn.crabnebula.app/asset/${id}`
          : `https://github.com/nomifun/nomifun-desktop/releases/download/v${version}/${name}`,
        platform: "macos",
        arch,
        format: "dmg",
        size: 154773110,
      },
    ],
  };
}

http
  .createServer((req, res) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-NomiFun-Preview", "local-download-simulation");
    let url, pathname;
    try {
      url = new URL(req.url, "http://localhost");
      pathname = decodeURIComponent(url.pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (pathname === "/api/releases") {
      const source = url.searchParams.get("source");
      if (
        req.method !== "GET" ||
        !Object.hasOwn(counts, source) ||
        url.searchParams.getAll("source").length !== 1
      ) {
        res.writeHead(400).end("Invalid fixture request.");
        return;
      }
      const attempt = ++counts[source];
      const failed = source === "github" && attempt > 1;
      const payload = failed
        ? { error: "Local simulation: GitHub metadata unavailable." }
        : fixture(source, attempt);
      res.writeHead(failed ? 503 : 200, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify(payload));
      console.log(
        `${source} request ${attempt}: ${failed ? "HTTP 503 (simulated)" : `v${payload.version} (simulated)`}`,
      );
      return;
    }
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    let file = path.resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    file = [file, file + ".html", path.join(file, "index.html")].find(
      (candidate) =>
        candidate.startsWith(root + path.sep) &&
        fs.existsSync(candidate) &&
        fs.statSync(candidate).isFile(),
    );
    if (!file) {
      file = path.join(root, "404.html");
      res.statusCode = 404;
    }
    if (!fs.existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    res.setHeader("Content-Length", fs.statSync(file).size);
    if (req.method === "HEAD") res.end();
    else fs.createReadStream(file).pipe(res);
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`LOCAL DOWNLOAD SIMULATION: http://127.0.0.1:${port}/download`);
    console.log(
      "Synthetic release URLs only. Do not click downloads; no upstream requests are made.",
    );
  });
