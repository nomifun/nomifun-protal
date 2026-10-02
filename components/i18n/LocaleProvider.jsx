"use client";
import { createContext, useContext, useMemo } from "react";
import { createI18n, DEFAULT_LOCALE } from "@/lib/i18n";
const LocaleContext = createContext(createI18n());
export default function LocaleProvider({ locale = DEFAULT_LOCALE, children }) {
  const value = useMemo(() => createI18n(locale), [locale]);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
export function useLocale() {
  return useContext(LocaleContext);
}
