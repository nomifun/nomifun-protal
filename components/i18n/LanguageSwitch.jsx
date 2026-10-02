"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "./LocaleProvider";
import { localizePath, stripLocale } from "@/lib/i18n";

export default function LanguageSwitch({ variant = "header" }) {
  const { locale, t } = useLocale();
  const pathname = usePathname();
  const nextLocale = locale === "zh" ? "en" : "zh";
  const nextPath = localizePath(stripLocale(pathname), nextLocale);
  const [href, setHref] = useState(nextPath);

  useEffect(() => {
    const update = () =>
      setHref(`${nextPath}${window.location.search}${window.location.hash}`);
    update();
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, [nextPath]);

  const link = (
    <a
      className="language-switch-link"
      href={href}
      hrefLang={nextLocale === "zh" ? "zh-CN" : "en"}
      lang={locale === "zh" ? "zh-CN" : "en"}
      aria-label={t("切换为英文", "Switch to Chinese")}
      title={t("English", "Simplified Chinese")}
    >
      <span lang={nextLocale === "zh" ? "zh-CN" : "en"}>
        {nextLocale === "en" ? "EN" : "中文"}
      </span>
    </a>
  );
  if (variant === "menu") {
    const current = (
      <span
        className="language-switch-current"
        aria-current="true"
        lang={locale === "zh" ? "zh-CN" : "en"}
      >
        {locale === "en" ? "EN" : "中文"}
      </span>
    );
    return (
      <div
        className="language-switch language-switch-menu"
        aria-label={t("网站语言", "Website language")}
      >
        {locale === "zh" ? current : link}
        {locale === "en" ? current : link}
      </div>
    );
  }
  return <div className="language-switch language-switch-header">{link}</div>;
}
