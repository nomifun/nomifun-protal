import http from "node:http";
import next from "next";
import releaseHandler from "../api/releases.mjs";

const portFlag = process.argv.indexOf("--port");
const port = Number(
  portFlag >= 0 ? process.argv[portFlag + 1] : process.env.PORT || 3107,
);
const hostname = process.env.PORTAL_HOST || "127.0.0.1";
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("Invalid development port.");
const app = next({ dev: true, hostname, port });
await app.prepare();
const nextHandler = app.getRequestHandler();
const server = http.createServer(async (req, res) => {
  try {
    const pathname = new URL(req.url, "http://localhost").pathname;
    if (pathname === "/api/releases") await releaseHandler(req, res);
    else await nextHandler(req, res);
  } catch (error) {
    console.error(error);
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
});
server.on("upgrade", app.getUpgradeHandler());
server.listen(port, hostname, () =>
  console.log(
    `NomiFun development preview listening on http://${hostname}:${port}`,
  ),
);
