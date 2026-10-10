import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { preconnect } from 'react-dom';
import { App } from '@/components/app';
import { AppFallback } from '@/components/app-fallback';
import { loadSourceData } from '@/services/sourceData';
import { parseMapCenter } from '@/utils/parseMapCenter';
import { layerCookieName, MAP_CENTER_LAT_COOKIE, MAP_CENTER_LON_COOKIE, MAP_ZOOM_COOKIE } from '@/utils/preferenceCookie';
import { splashScreens } from './splash-screens';

export const viewport: Viewport = {
  themeColor: '#334155',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Sunpeak App — Webcams from all over Switzerland',
  description:
    "This interactive map displays webcams from all over Switzerland, giving you a real-time glimpse of the current weather conditions and helping you plan your next outdoor adventure. So why wait? Let's find out where the sun is shining today!",
  openGraph: {
    title: 'Sunpeak App — Webcams from all over Switzerland',
    description:
      "This interactive map displays webcams from all over Switzerland, giving you a real-time glimpse of the current weather conditions and helping you plan your next outdoor adventure. So why wait? Let's find out where the sun is shining today!",
    images: ['/sunpeak-open-graph.jpg'],
    url: 'https://sunpeak.app',
  },
  referrer: 'origin-when-cross-origin',
  creator: 'Kevin Walker',
  applicationName: 'Sunpeak',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Sunpeak',
    statusBarStyle: 'black-translucent',
    startupImage: splashScreens,
  },
  icons: [
    { rel: 'icon', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ],
};

export default async function Page() {
  // Not awaited: the app unwraps the promise with use() inside the Suspense boundary, so the
  // header and loading map stream right away while the sources load
  const sources = loadSourceData();
  const cookieStore = await cookies();
  const center = parseMapCenter(
    cookieStore.get(MAP_CENTER_LAT_COOKIE)?.value,
    cookieStore.get(MAP_CENTER_LON_COOKIE)?.value,
    cookieStore.get(MAP_ZOOM_COOKIE)?.value,
  );

  const mapboxUrl = `https://api.mapbox.com/styles/v1/${process.env.MAPBOX_USER_ID}/${process.env.MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;

  // Tiles are the first thing the map requests once it mounts; Next sends this as a Link response header
  preconnect('https://api.mapbox.com');

  return (
    <Suspense fallback={<AppFallback />}>
      <App
        sources={sources}
        mapboxUrl={mapboxUrl}
        center={center}
        isWindVisible={cookieStore.get(layerCookieName('Wind'))?.value === 'true'}
        isTemperatureVisible={cookieStore.get(layerCookieName('Temperature'))?.value !== 'false'}
        isWebcamsVisible={cookieStore.get(layerCookieName('Webcams'))?.value !== 'false'}
      />
    </Suspense>
  );
}
