import fs from "node:fs";
import path from "node:path";
const root = path.resolve("out");
if (!fs.existsSync(root)) {
  console.error("Run npm run build first.");
  process.exit(1);
}
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
const files = walk(root),
  pages = files.filter((f) => f.endsWith(".html")),
  issues = [];
const existsRoute = (pathname) => {
  const p = path.resolve(root, "." + decodeURIComponent(pathname));
  if (p !== root && !p.startsWith(root + path.sep)) return null;
  return [p, path.join(p, "index.html"), p + ".html"].find(
    (f) => fs.existsSync(f) && fs.statSync(f).isFile(),
  );
};
let linkCount = 0,
  assetCount = 0;
for (const page of pages) {
  const html = fs.readFileSync(page, "utf8"),
    rel = path.relative(root, page);
  const english =
    rel === "en.html" ||
    rel.replaceAll(path.sep, "/").startsWith("en/") ||
    rel === "404.html";
  if (!html.includes(`lang="${english ? "en" : "zh-CN"}"`))
    issues.push(`${rel}: wrong document language`);
  if ((html.match(/<main\b/g) || []).length !== 1)
    issues.push(`${rel}: expected one main landmark`);
  if ((html.match(/<h1\b/g) || []).length !== 1)
    issues.push(`${rel}: expected one h1`);
  const attr = html.matchAll(/\b(href|src|poster)="([^"]+)"/g);
  for (const [, type, raw] of attr) {
    const value = raw.replaceAll("&amp;", "&");
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/.test(value)) continue;
    if (!value.startsWith("/") && !value.startsWith("#")) continue;
    const url = new URL(
      value,
      "https://www.nomifun.com" +
        (rel === "index.html" ? "/" : "/" + rel.replace(/\.html$/, "")),
    );
    if (
      type === "href" &&
      (value.startsWith("#") || !path.extname(url.pathname))
    ) {
      linkCount++;
      const target = value.startsWith("#") ? page : existsRoute(url.pathname);
      if (!target) {
        issues.push(`${rel}: missing route ${value}`);
        continue;
      }
      if (url.hash) {
        const targetHtml = fs.readFileSync(target, "utf8"),
          id = decodeURIComponent(url.hash.slice(1));
        if (!targetHtml.includes(`id="${id}"`))
          issues.push(`${rel}: missing anchor ${value}`);
      }
    } else {
      assetCount++;
      if (!existsRoute(url.pathname))
        issues.push(`${rel}: missing asset ${value}`);
    }
  }
}
const required = [
  "/",
  "/products",
  "/products/desktop",
  "/products/mobile",
  "/products/xiaozhi-yuntai",
  "/products/net-infra",
  "/download",
  "/blog",
  "/contact",
  "/blog/nomifun-origin-story",
  "/blog/composable-agents",
  "/blog/one-local-hub",
];
for (const expected of [
  ...required,
  ...required.map((route) => `/en${route === "/" ? "" : route}`),
])
  if (!existsRoute(expected)) issues.push(`Missing required page: ${expected}`);
if (issues.length) {
  console.error([...new Set(issues)].join("\n"));
  process.exit(1);
}
console.log(
  `PASS: ${pages.length} HTML pages; ${linkCount} internal links/anchors; ${assetCount} asset references.`,
);
