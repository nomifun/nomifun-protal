import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("out");
const port = Number(process.env.PORT || 3107);
const host = process.env.PORTAL_HOST || "127.0.0.1";
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
http
  .createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
    } catch {
      res.writeHead(400).end();
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
    const stat = fs.statSync(file);
    res.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    res.setHeader("Accept-Ranges", "bytes");
    const range = req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
    if (range) {
      const start = Number(range[1]),
        end = range[2]
          ? Math.min(Number(range[2]), stat.size - 1)
          : stat.size - 1;
      if (start >= stat.size || end < start) {
        res.writeHead(416, { "Content-Range": `bytes */${stat.size}` }).end();
        return;
      }
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Content-Length": end - start + 1,
      });
      fs.createReadStream(file, { start, end }).pipe(res);
      return;
    }
    res.setHeader("Content-Length", stat.size);
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, host, () =>
    console.log(`NomiFun static preview listening on ${host}:${port}`),
  );
