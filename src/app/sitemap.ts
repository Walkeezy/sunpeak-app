import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/config';
import { settle } from '@/services/sourceResult';
import { getWebcamData } from '@/services/webcamData';
import { escapeHtml } from '@/utils/escapeHtml';
import { localizedPath } from '@/utils/paths';

// Regenerated hourly like the webcam list; falls back to the static pages when the list can't be loaded
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const absolute = (path: string) => `${SITE_URL}${path}`;

// One entry per language, each pointing at all translations (hreflang)
const localizedEntries = (path: string, entry: Omit<Entry, 'url' | 'alternates'>): Entry[] => {
  const languages = {
    ...Object.fromEntries(LOCALES.map((locale) => [locale, absolute(localizedPath(locale, path))])),
    'x-default': absolute(localizedPath(DEFAULT_LOCALE, path)),
  };

  return LOCALES.map((locale) => ({ ...entry, url: absolute(localizedPath(locale, path)), alternates: { languages } }));
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: webcams } = await settle(getWebcamData(), []);

  return [
    ...localizedEntries('/', { changeFrequency: 'always', priority: 1 }),
    ...localizedEntries('/webcams', { changeFrequency: 'daily', priority: 0.8 }),
    ...localizedEntries('/info', { changeFrequency: 'yearly', priority: 0.3 }),
    ...webcams.flatMap(({ slug, fullsize }) =>
      localizedEntries(`/webcams/${encodeURIComponent(slug)}`, {
        changeFrequency: 'hourly',
        priority: 0.7,
        // Next writes image URLs into the XML unescaped, so a query string with & would break the sitemap
        images: [escapeHtml(fullsize)],
      }),
    ),
  ];
}
