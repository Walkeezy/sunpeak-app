// Plain module without next/* imports, so the proxy, client components and tests can share it
export const LOCALES = ['de', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

// German is the primary audience and the fallback for search engines (x-default)
export const DEFAULT_LOCALE: Locale = 'de';

export const LOCALE_COOKIE = 'locale';

export const hasLocale = (value: string | undefined | null): value is Locale => LOCALES.includes(value as Locale);
