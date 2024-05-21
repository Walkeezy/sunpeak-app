/* eslint-disable @typescript-eslint/no-empty-function */

import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import NextLink from 'next/link';
import { Header } from '../components/header';
import { InfoIcon } from '../components/icons/info';
import { Logo } from '../components/logo';
import { getTemperatureData } from '../services/weatherData';
import { getWebcamData } from '../services/webcamData';

export const metadata: Metadata = {
  title: 'Sunpeak App — Webcams from all over Switzerland',
  description:
    "This interactive map displays webcams from all over Switzerland, giving you a real-time glimpse of the current weather conditions and helping you plan your next outdoor adventure. So why wait? Let's find out where the sun is shining today!",
};

export default async function Page() {
  const webcamData = await getWebcamData();
  const temperatureData = await getTemperatureData();

  const cookieStore = cookies();
  const centerLat = cookieStore.get('centerLat')?.value;
  const centerLon = cookieStore.get('centerLon')?.value;
  const zoom = cookieStore.get('zoom')?.value;

  const center = centerLat && centerLon && zoom ? { centerLat, centerLon, zoom } : undefined;

  const DynamicMap = dynamic(() => import('../components/map').then((mod) => mod.Map), {
    loading: () => <p>A map is loading</p>,
    ssr: false,
  });

  const mapboxUrl = `https://api.mapbox.com/styles/v1/${process.env.MAPBOX_USER_ID}/${process.env.MAPBOX_STYLE_ID}/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;

  return (
    <div className="absolute left-0 top-0 flex h-full w-full flex-col">
      <Header>
        <NextLink href="/info" title="Go to info page">
          <InfoIcon />
        </NextLink>
        <Logo />
        {/* <Refresh reloadData={handleReloadData} isRefreshing={dataLoading} /> */}
      </Header>

      <main data-test-id="index-page" className="grow bg-slate-700">
        <DynamicMap
          webcamData={webcamData}
          temperatureData={temperatureData}
          mapboxUrl={mapboxUrl}
          center={center ?? undefined}
        />
      </main>
    </div>
  );
}
