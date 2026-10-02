import { getPosts } from "@/lib/blog";
import { DEFAULT_LOCALE, localizePath, locales } from "@/lib/i18n";
export const dynamic = "force-static";
export default function sitemap() {
  const routes = [
    "",
    "/products",
    "/products/desktop",
    "/products/mobile",
    "/products/xiaozhi-yuntai",
    "/products/net-infra",
    "/download",
    "/blog",
    "/contact",
    ...getPosts().map((p) => `/blog/${p.slug}`),
  ];
  const url = (route, locale) =>
    `https://www.nomifun.com${localizePath(route || "/", locale)}`;
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: url(route, locale),
      alternates: {
        languages: {
          "zh-CN": url(route, "zh"),
          en: url(route, "en"),
          "x-default": url(route, DEFAULT_LOCALE),
        },
      },
      changeFrequency: route === "" ? "weekly" : "monthly",
      priority: route === "" ? 1 : 0.7,
    })),
  );
}
