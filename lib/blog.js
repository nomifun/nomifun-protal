import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const blogDirectory = path.join(process.cwd(), "content", "blog");

export function getPosts(locale = "zh") {
  if (locale !== "zh" && locale !== "en") {
    throw new Error(`Unsupported blog locale: ${locale}`);
  }
  const directory =
    locale === "en" ? path.join(blogDirectory, "en") : blogDirectory;
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.slice(0, -3);
      const { data, content } = matter(
        fs.readFileSync(path.join(directory, file), "utf8"),
      );
      return {
        ...data,
        slug,
        content,
        publishedAt: String(data.publishedAt),
        formattedDate: formatDate(String(data.publishedAt), locale),
        html: marked.parse(content),
      };
    })
    .filter((post) => !post.draft)
    .sort(
      (a, b) =>
        b.publishedAt.localeCompare(a.publishedAt) ||
        a.slug.localeCompare(b.slug),
    );
}

export function getPost(slug, locale = "zh") {
  return getPosts(locale).find((post) => post.slug === slug);
}

export function formatDate(value, locale = "zh") {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(new Date(`${value.slice(0, 10)}T00:00:00+08:00`));
}
