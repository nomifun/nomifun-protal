import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const source = fs.readFileSync("lib/i18n/index.js", "utf8");
const { localizePath, stripLocale, createI18n } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
for (const [input, locale, expected] of [
  ["/", "en", "/"],
  ["/", "zh", "/zh"],
  ["/#agent", "en", "/#agent"],
  ["/#agent", "zh", "/zh#agent"],
  [
    "/blog/one-local-hub?ref=home#design",
    "en",
    "/blog/one-local-hub?ref=home#design",
  ],
  ["/en/products/desktop", "en", "/products/desktop"],
  ["/en/products/desktop", "zh", "/zh/products/desktop"],
  ["/zh/products/desktop", "en", "/products/desktop"],
  ["/zh/products/desktop", "zh", "/zh/products/desktop"],
  ["/en#agent", "zh", "/zh#agent"],
  ["/en?ref=nav", "zh", "/zh?ref=nav"],
  ["/zh#agent", "en", "/#agent"],
  ["/zh?ref=nav", "en", "/?ref=nav"],
  [
    "https://github.com/nomifun/nomifun-desktop",
    "en",
    "https://github.com/nomifun/nomifun-desktop",
  ],
  ["mailto:535526063@qq.com", "en", "mailto:535526063@qq.com"],
  ["#creation", "en", "#creation"],
])
  assert.equal(localizePath(input, locale), expected);
assert.equal(stripLocale("/enlightened"), "/enlightened");
assert.equal(stripLocale("/zhongwen"), "/zhongwen");
assert.equal(localizePath("/products"), "/products");
assert.equal(createI18n().locale, "en");
assert.equal(createI18n("en").t("知识", "Knowledge"), "Knowledge");
assert.equal(createI18n("zh").t("知识", "Knowledge"), "知识");
const root = path.resolve("out");
if (!fs.existsSync(root)) throw new Error("Run npm run build first.");
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((item) =>
      item.isDirectory()
        ? walk(path.join(dir, item.name))
        : [path.join(dir, item.name)],
    );
const contentPages = walk(root).filter(
  (file) => file.endsWith(".html") && path.relative(root, file) !== "404.html",
);
const chinesePages = contentPages.filter((file) =>
  /^zh(?:\.html$|\/)/.test(path.relative(root, file).replaceAll(path.sep, "/")),
);
const englishPages = contentPages.filter(
  (file) => !chinesePages.includes(file),
);
const issues = [];
const han = /[\u3400-\u9fff]/;
const voidTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
const decode = (value) =>
  value.replace(/&#(?:x([\da-f]+)|(\d+));/gi, (_, hex, decimal) =>
    String.fromCodePoint(parseInt(hex || decimal, hex ? 16 : 10)),
  );
const attributes = (token) =>
  Object.fromEntries(
    [...token.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(
      ([, key, a, b]) => [key.toLowerCase(), decode(a ?? b)],
    ),
  );
for (const file of englishPages) {
  const html = fs.readFileSync(file, "utf8"),
    rel = path.relative(root, file);
  if (!/<html\b[^>]*\blang="en"/.test(html))
    issues.push(`${rel}: wrong English html lang`);
  const stack = [];
  for (const token of html.match(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g) || []) {
    if (token.startsWith("<!--")) continue;
    if (token.startsWith("</")) {
      const tag = token.match(/^<\/\s*([\w:-]+)/)?.[1]?.toLowerCase();
      const index = stack.findLastIndex((entry) => entry.tag === tag);
      if (index >= 0) stack.length = index;
      continue;
    }
    const parent = stack.at(-1);
    if (token.startsWith("<")) {
      const tag = token.match(/^<\s*([\w:-]+)/)?.[1]?.toLowerCase();
      if (!tag) continue;
      const attrs = attributes(token);
      const skip = parent?.skip || tag === "script" || tag === "style";
      const chinese = attrs.lang
        ? attrs.lang.startsWith("zh")
        : parent?.chinese;
      if (!skip && !chinese)
        for (const key of [
          "alt",
          "title",
          "aria-label",
          "placeholder",
          "value",
        ])
          if (han.test(attrs[key] || ""))
            issues.push(`${rel}: untranslated ${key}: ${attrs[key]}`);
      if (
        tag === "a" &&
        attrs.href?.startsWith("/") &&
        !attrs.href.startsWith("//") &&
        /^\/zh(?:[/?#]|$)/.test(attrs.href) &&
        !attrs.hreflang?.startsWith("zh") &&
        !/\.(?:mp4|png|svg|webp|jpg|pdf|zip)(?:[?#]|$)/i.test(attrs.href)
      )
        issues.push(`${rel}: link leaves English site: ${attrs.href}`);
      if (!voidTags.has(tag) && !token.endsWith("/>"))
        stack.push({ tag, skip, chinese });
    } else if (!parent?.skip && !parent?.chinese && han.test(decode(token))) {
      issues.push(
        `${rel}: untranslated text: ${decode(token).trim().slice(0, 150)}`,
      );
    }
  }
}
assert.equal(
  englishPages.length,
  24,
  "Expected 12 English routes and 12 /en aliases",
);
assert.equal(
  chinesePages.length,
  12,
  "Expected all 12 Chinese routes under /zh",
);
for (const file of contentPages) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(root, file).replaceAll(path.sep, "/");
  const route = rel === "index.html" ? "/" : `/${rel.replace(/\.html$/, "")}`;
  const locale = chinesePages.includes(file) ? "zh" : "en";
  const metadataLinks = (html.match(/<link\b[^>]*>/g) || []).map(attributes);
  const metadataUrl = (targetLocale) =>
    new URL(localizePath(route, targetLocale), "https://www.nomifun.com").href;
  const normalizeUrl = (href) =>
    href ? new URL(href, "https://www.nomifun.com").href : null;
  if (!html.includes(`<html lang="${locale === "zh" ? "zh-CN" : "en"}"`))
    issues.push(`${rel}: document language mismatch`);
  const canonical = metadataLinks.find((link) => link.rel === "canonical");
  if (normalizeUrl(canonical?.href) !== metadataUrl(locale))
    issues.push(`${rel}: canonical mismatch`);
  for (const [language, targetLocale] of [
    ["zh-CN", "zh"],
    ["en", "en"],
    ["x-default", "en"],
  ]) {
    const alternate = metadataLinks.find(
      (link) => link.rel === "alternate" && link.hreflang === language,
    );
    if (normalizeUrl(alternate?.href) !== metadataUrl(targetLocale))
      issues.push(`${rel}: incorrect ${language} alternate`);
  }
  if (html.includes('id="nomifun-language-preference"'))
    issues.push(`${rel}: stale language redirect script`);
}
for (const original of [
  "/images/product/agent-workbench.png",
  "/images/creative/image-workbench.png",
  "/images/creative/video-workbench.png",
]) {
  const english = createI18n("en").asset(original);
  assert.notEqual(english, original);
  assert.ok(
    fs.existsSync(path.join(root, english)),
    `Missing English asset ${english}`,
  );
  assert.notDeepEqual(
    fs.readFileSync(path.join(root, english)),
    fs.readFileSync(path.join(root, original)),
    `English asset is a Chinese duplicate: ${english}`,
  );
}
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
assert.equal(
  (sitemap.match(/<url>/g) || []).length,
  24,
  "Expected 24 bilingual sitemap URLs",
);
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  ([, url]) => url,
);
assert.equal(new Set(sitemapUrls).size, 24, "Sitemap URLs must be unique");
assert.ok(sitemapUrls.includes("https://www.nomifun.com/"));
assert.ok(sitemapUrls.includes("https://www.nomifun.com/zh"));
assert.ok(
  !sitemapUrls.some((url) =>
    /^https:\/\/www\.nomifun\.com\/en(?:\/|$)/.test(url),
  ),
  "English aliases must use the root canonical in the sitemap",
);
if (issues.length) {
  console.error([...new Set(issues)].join("\n"));
  process.exit(1);
}
console.log(
  `PASS: ${englishPages.length} English pages (including /en aliases), ${chinesePages.length} Chinese pages; localized links, canonical/hreflang, English text/ARIA, 3 distinct English assets, 24 canonical sitemap URLs, and language path helpers.`,
);
