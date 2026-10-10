export const DEFAULT_LOCALE = "en";
export const locales = ["en", "zh"];
export const localeNames = { zh: "简体中文", en: "English" };
export function translate(locale, zh, en) {
  return locale === "en" ? en : zh;
}
export function stripLocale(pathname = "/") {
  const base = pathname.replace(/^\/(?:en|zh)(?=\/|[?#]|$)/, "");
  return !base || /^[?#]/.test(base) ? `/${base}` : base;
}
export function localizePath(href, locale = DEFAULT_LOCALE) {
  if (
    typeof href !== "string" ||
    !href.startsWith("/") ||
    href.startsWith("//")
  )
    return href;
  const base = stripLocale(href);
  const [, pathname, suffix] = base.match(/^([^?#]*)(.*)$/);
  return locale === "zh"
    ? `/zh${pathname === "/" ? "" : pathname}${suffix}`
    : base;
}
export function createI18n(locale = DEFAULT_LOCALE) {
  return {
    locale,
    t: (zh, en) => translate(locale, zh, en),
    path: (href) => localizePath(href, locale),
    asset: (src) => localizeAsset(src, locale),
  };
}
const englishAssets = {
  "/images/product/agent-workbench.png":
    "/images/product/en/agent-workbench.png",
  "/images/product/desktop-chat.png": "/images/product/en/desktop-chat.png",
  "/images/product/desktop-canvas.png":
    "/images/product/en/desktop-canvas.png",
  "/images/product/autowork.png": "/images/product/en/autowork.png",
  "/images/creative/image-workbench.png":
    "/images/creative/en/image-workbench.png",
  "/images/creative/video-workbench.png":
    "/images/creative/en/video-workbench.png",
};
export function localizeAsset(src, locale = DEFAULT_LOCALE) {
  return locale === "en" ? englishAssets[src] || src : src;
}
export function pageMetadata(
  locale,
  pathname,
  zhTitle,
  enTitle,
  zhDescription,
  enDescription,
) {
  const { t, path } = createI18n(locale);
  return {
    title: t(zhTitle, enTitle),
    description: t(zhDescription, enDescription),
    alternates: {
      canonical: path(pathname),
      languages: {
        "zh-CN": localizePath(pathname, "zh"),
        en: localizePath(pathname, "en"),
        "x-default": localizePath(pathname, DEFAULT_LOCALE),
      },
    },
    openGraph: {
      title: t(zhTitle, enTitle),
      description: t(zhDescription, enDescription),
      url: path(pathname),
      locale: locale === "en" ? "en_US" : "zh_CN",
      alternateLocale: locale === "en" ? "zh_CN" : "en_US",
    },
  };
}
