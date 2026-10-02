import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const source = fs.readFileSync("lib/i18n/index.js", "utf8");
const { localizePath, stripLocale, createI18n } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
for (const [input, locale, expected] of [
  ["/", "en", "/en"],
  ["/#agent", "en", "/en#agent"],
  [
    "/blog/one-local-hub?ref=home#design",
    "en",
    "/en/blog/one-local-hub?ref=home#design",
  ],
  ["/en/products/desktop", "en", "/en/products/desktop"],
  ["/en#agent", "zh", "/#agent"],
  ["/en?ref=nav", "zh", "/?ref=nav"],
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
const englishPages = walk(root).filter(
  (file) =>
    file.endsWith(".html") &&
    (path.relative(root, file).replaceAll(path.sep, "/").startsWith("en/") ||
      path.relative(root, file) === "en.html"),
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
  const route =
    rel === "en.html"
      ? "/en"
      : `/${rel.replaceAll(path.sep, "/").replace(/\.html$/, "")}`;
  if (!html.includes(`rel="canonical" href="https://www.nomifun.com${route}"`))
    issues.push(`${rel}: canonical mismatch`);
  for (const language of ["zh-CN", "en"])
    if (!html.includes(`hrefLang="${language}"`))
      issues.push(`${rel}: missing ${language} alternate`);
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
        !/^\/en(?:[/?#]|$)/.test(attrs.href) &&
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
assert.equal(englishPages.length, 12, "Expected all 12 English content routes");
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
if (issues.length) {
  console.error([...new Set(issues)].join("\n"));
  process.exit(1);
}
console.log(
  `PASS: ${englishPages.length} English pages; localized links, canonical/hreflang, English text/ARIA, 3 distinct English assets, 24 sitemap URLs, and language path helpers.`,
);
