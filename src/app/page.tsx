import { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { App } from '../components/app';
import { getTemperatureData } from '../services/temperatureData';
import { getWebcamData } from '../services/webcamData';
import { getWindData } from '../services/windData';
import { splashScreens } from './splash-screens';

export const viewport: Viewport = {
  themeColor: '#334155',
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
    statusBarStyle: 'default',
    startupImage: splashScreens,
  },
  icons: [
    { rel: 'icon', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ],
};

export default async function Page() {
  const webcamData = await getWebcamData();
  const temperatureData = await getTemperatureData();
  const windData = await getWindData();

  const cookieStore = await cookies();

  const centerLat = cookieStore.get('centerLat')?.value;
  const centerLon = cookieStore.get('centerLon')?.value;
  const zoom = cookieStore.get('zoom')?.value;
  const center = centerLat && centerLon && zoom ? { centerLat, centerLon, zoom } : undefined;

  const mapboxUrl = `https://api.mapbox.com/styles/v1/${process.env.MAPBOX_USER_ID}/${process.env.MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;

  return (
    <App
      mapboxUrl={mapboxUrl}
      webcamData={webcamData}
      temperatureData={temperatureData}
      windData={windData}
      center={center}
      isWindVisible={cookieStore.get('Wind')?.value === 'true' || false}
      isTemperatureVisible={cookieStore.get('Temperatur')?.value === 'true' || true}
      isWebcamsVisible={cookieStore.get('Webcams')?.value === 'true' || true}
    />
  );
}
