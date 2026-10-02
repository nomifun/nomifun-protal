"use client";
import { createContext, useContext, useEffect, useMemo } from "react";
import { createI18n } from "@/lib/i18n";
const LocaleContext = createContext(createI18n("zh"));
export default function LocaleProvider({ locale, children }) {
  const value = useMemo(() => createI18n(locale), [locale]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nomifun-portal-locale");
      if (
        locale === "zh" &&
        window.location.pathname === "/" &&
        saved === "en"
      ) {
        window.location.replace(
          `/en${window.location.search}${window.location.hash}`,
        );
        return;
      }
      localStorage.setItem("nomifun-portal-locale", locale);
    } catch {
      /* Language links also work when storage is unavailable. */
    }
  }, [locale]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
export function useLocale() {
  return useContext(LocaleContext);
}
