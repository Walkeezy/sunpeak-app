import { hasLocale, type Locale } from '@/i18n/config';

// The search param that opens a webcam on the map, e.g. /de?cam=saentis-schwaegalp
export const CAM_SEARCH_PARAM = 'cam';

// Prefixes an unlocalized path ("/", "/info", "/webcams/x") with the locale
export const localizedPath = (locale: Locale, path: string): string => (path === '/' ? `/${locale}` : `/${locale}${path}`);

export const mapPath = (locale: Locale): string => localizedPath(locale, '/');

// The map with the webcam opened in the overlay
export const mapWithWebcamPath = (locale: Locale, slug: string): string =>
  `${mapPath(locale)}?${CAM_SEARCH_PARAM}=${encodeURIComponent(slug)}`;

export const infoPath = (locale: Locale): string => localizedPath(locale, '/info');

export const webcamsPath = (locale: Locale): string => localizedPath(locale, '/webcams');

// The webcam's own, indexable page
export const webcamPagePath = (locale: Locale, slug: string): string =>
  localizedPath(locale, `/webcams/${encodeURIComponent(slug)}`);

// The same page in another language: swaps or adds the locale prefix
export const switchLocalePath = (pathname: string, locale: Locale): string => {
  const segments = pathname.split('/').filter(Boolean);

  if (hasLocale(segments[0])) {
    segments.shift();
  }

  return ['', locale, ...segments].join('/');
};
