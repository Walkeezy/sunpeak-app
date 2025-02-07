/* eslint-disable @typescript-eslint/no-empty-function */

import { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { App } from '../components/app';
import { getTemperatureData } from '../services/temperatureData';
import { getWebcamData } from '../services/webcamData';
import { getWindData } from '../services/windData';

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
    startupImage: [
      {
        url: 'splash_screens/iPhone_16_Pro_Max_landscape.png',
        media:
          'screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/iPhone_16_Pro_landscape.png',
        media:
          'screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png',
        media:
          'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png',
        media:
          'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png',
        media:
          'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png',
        media:
          'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png',
        media:
          'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png',
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/iPhone_11__iPhone_XR_landscape.png',
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png',
        media:
          'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png',
        media:
          'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png',
        media:
          'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/13__iPad_Pro_M4_landscape.png',
        media:
          'screen and (device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/12.9__iPad_Pro_landscape.png',
        media:
          'screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/11__iPad_Pro_M4_landscape.png',
        media:
          'screen and (device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png',
        media:
          'screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/10.9__iPad_Air_landscape.png',
        media:
          'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/10.5__iPad_Air_landscape.png',
        media:
          'screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/10.2__iPad_landscape.png',
        media:
          'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png',
        media:
          'screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/8.3__iPad_Mini_landscape.png',
        media:
          'screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)',
      },
      {
        url: 'splash_screens/iPhone_16_Pro_Max_portrait.png',
        media:
          'screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/iPhone_16_Pro_portrait.png',
        media:
          'screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png',
        media:
          'screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png',
        media:
          'screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png',
        media:
          'screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png',
        media:
          'screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png',
        media:
          'screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png',
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/iPhone_11__iPhone_XR_portrait.png',
        media:
          'screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png',
        media:
          'screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png',
        media:
          'screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png',
        media:
          'screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/13__iPad_Pro_M4_portrait.png',
        media:
          'screen and (device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/12.9__iPad_Pro_portrait.png',
        media:
          'screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/11__iPad_Pro_M4_portrait.png',
        media:
          'screen and (device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png',
        media:
          'screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/10.9__iPad_Air_portrait.png',
        media:
          'screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/10.5__iPad_Air_portrait.png',
        media:
          'screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/10.2__iPad_portrait.png',
        media:
          'screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png',
        media:
          'screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        url: 'splash_screens/8.3__iPad_Mini_portrait.png',
        media:
          'screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
    ],
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
