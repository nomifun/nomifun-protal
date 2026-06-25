/**
 * i18n core for the NomiFun portal.
 *
 * Routing: zh-CN at the root ("/"), en-US under "/en".
 * Content lives in `src/i18n/dict/*.ts` — each section/page owns its own
 * dictionary file (one file holds both `zh-CN` and `en-US`) so that parallel
 * work never collides on a single mega-dictionary.
 */

export const LOCALES = ['zh-CN', 'en-US'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'zh-CN';

/** A dictionary entry: the same key resolved per locale. */
export type Dict<T> = Record<Locale, T>;

/** Derive the active locale from the request URL pathname. */
export function getLocale(url: URL | string): Locale {
  const pathname = typeof url === 'string' ? url : url.pathname;
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en-US' : 'zh-CN';
}

/** Prefix a root-relative path with the locale segment when needed. */
export function localizePath(path: string, locale: Locale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en-US') {
    return clean === '/' ? '/en' : `/en${clean}`;
  }
  return clean;
}

/** Strip the locale prefix from a pathname (for building the language toggle). */
export function delocalizePath(pathname: string): string {
  if (pathname === '/en') return '/';
  if (pathname.startsWith('/en/')) return pathname.slice(3) || '/';
  return pathname || '/';
}

/** Toggle a pathname to the other locale. */
export function alternatePath(pathname: string, target: Locale): string {
  return localizePath(delocalizePath(pathname), target);
}

/** Pick the value for the active locale from a Dict. */
export function pick<T>(dict: Dict<T>, locale: Locale): T {
  return dict[locale] ?? dict[DEFAULT_LOCALE];
}

/** Resolve a whole dictionary object to a single-locale shallow view. */
export function resolveDict<T extends Record<string, Dict<unknown>>>(
  obj: T,
  locale: Locale
): { [K in keyof T]: T[K][Locale] } {
  const out = {} as { [K in keyof T]: T[K][Locale] };
  for (const k in obj) out[k] = obj[k][locale] as T[typeof k][Locale];
  return out;
}

export const htmlLang: Record<Locale, string> = {
  'zh-CN': 'zh-CN',
  'en-US': 'en',
};
