import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { preconnect } from 'react-dom';
import { App } from '@/components/app';
import { AppFallback } from '@/components/app-fallback';
import { getMessages } from '@/i18n/messages';
import { localizedAlternates, localizedOpenGraph } from '@/i18n/metadata';
import { requireLocale } from '@/i18n/server';
import { loadSourceData } from '@/services/sourceData';
import { parseMapCenter } from '@/utils/parseMapCenter';
import { CAM_SEARCH_PARAM } from '@/utils/paths';
import {
  layerVisibilityFromCookies,
  MAP_CENTER_LAT_COOKIE,
  MAP_CENTER_LON_COOKIE,
  MAP_ZOOM_COOKIE,
} from '@/utils/preferenceCookie';

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const { meta } = getMessages(locale);

  return {
    title: { absolute: meta.siteTitle },
    description: meta.siteDescription,
    // ?cam=… opens a webcam on the map; its indexable page lives under /webcams, so the map stays one URL per language
    alternates: localizedAlternates(locale, '/'),
    openGraph: localizedOpenGraph(locale, { title: meta.siteTitle, description: meta.siteDescription, path: '/' }),
  };
}

export default async function Page({ params, searchParams }: PageProps<'/[locale]'>) {
  // Rejects unknown locales and stray single segments that skip the proxy, such as /foo.png
  requireLocale((await params).locale);
  // Not awaited: the app unwraps the promise with use() inside the Suspense boundary, so the
  // header and loading map stream right away while the sources load
  const sources = loadSourceData();
  const [cookieStore, { [CAM_SEARCH_PARAM]: cam }] = await Promise.all([cookies(), searchParams]);
  const center = parseMapCenter(
    cookieStore.get(MAP_CENTER_LAT_COOKIE)?.value,
    cookieStore.get(MAP_CENTER_LON_COOKIE)?.value,
    cookieStore.get(MAP_ZOOM_COOKIE)?.value,
  );

  // The tile style and tiles are the first thing the map requests once it mounts; Next sends this as a Link header
  preconnect('https://vectortiles.geo.admin.ch');

  return (
    <Suspense fallback={<AppFallback />}>
      <App
        sources={sources}
        center={center}
        layers={layerVisibilityFromCookies((name) => cookieStore.get(name)?.value)}
        initialCamSlug={typeof cam === 'string' ? cam : undefined}
      />
    </Suspense>
  );
}
