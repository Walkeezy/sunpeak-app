import type { Metadata } from 'next';
import { localizedPath } from '@/utils/paths';
import { DEFAULT_LOCALE, LOCALES, type Locale } from './config';

const OPEN_GRAPH_LOCALES: Record<Locale, string> = { de: 'de_CH', en: 'en_US' };

const DEFAULT_IMAGE = '/sunpeak-open-graph.jpg';

// Canonical URL of the page in this locale plus hreflang links to every translation
export const localizedAlternates = (locale: Locale, path: string): Metadata['alternates'] => ({
  canonical: localizedPath(locale, path),
  languages: {
    ...Object.fromEntries(LOCALES.map((other) => [other, localizedPath(other, path)])),
    'x-default': localizedPath(DEFAULT_LOCALE, path),
  },
});

type OpenGraphInput = {
  title: string;
  description: string;
  path: string;
  images?: NonNullable<Metadata['openGraph']>['images'];
};

// Open Graph fields are replaced, not merged, between segments, so every page builds the full set
export const localizedOpenGraph = (
  locale: Locale,
  { title, description, path, images = [DEFAULT_IMAGE] }: OpenGraphInput,
): Metadata['openGraph'] => ({
  title,
  description,
  url: localizedPath(locale, path),
  siteName: 'Sunpeak',
  locale: OPEN_GRAPH_LOCALES[locale],
  alternateLocale: LOCALES.filter((other) => other !== locale).map((other) => OPEN_GRAPH_LOCALES[other]),
  images,
  type: 'website',
});
