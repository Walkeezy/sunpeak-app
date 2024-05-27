'use client';

import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { FC, useState } from 'react';
import { TemperatureData } from '../services/temperatureData';
import { WebcamData } from '../services/webcamData';
import { WindData } from '../services/windData';
import { generateRefreshQuery } from '../utils/generateRefreshQuery';
import { Header } from './header';
import { InfoIcon } from './icons/info';
import { LoadingMap } from './loading-map';
import { Logo } from './logo';
import { Refresh } from './refresh';

type Props = {
  mapboxUrl: string;
  webcamData: WebcamData;
  temperatureData: TemperatureData;
  windData: WindData;
  center?: { centerLat: string; centerLon: string; zoom: string };
  isWindVisible: boolean;
  isTemperatureVisible: boolean;
  isWebcamsVisible: boolean;
};

const DynamicMap = dynamic(() => import('../components/map').then((module) => module.Map), {
  loading: () => <LoadingMap />,
  ssr: false,
});

export const App: FC<Props> = ({
  mapboxUrl,
  webcamData,
  temperatureData,
  windData,
  center,
  isWindVisible,
  isTemperatureVisible,
  isWebcamsVisible,
}) => {
  const [dataLoading, setDataLoading] = useState(false);
  const [tempData, setTempData] = useState(temperatureData);
  const [localWindData, setWindData] = useState(windData);
  const [refreshQuery, setRefreshQuery] = useState<string>(generateRefreshQuery());

  const handleReloadData = async () => {
    try {
      setDataLoading(true);
      setRefreshQuery(new Date().getTime().toString());
      const response = await fetch('/api/data');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data: { temperatureData: TemperatureData; windData: WindData } = await response.json();
      setTempData(data.temperatureData);
      setWindData(data.windData);
      setDataLoading(false);
    } catch (error) {
      console.error(error);
      setDataLoading(false);
    }
  };

  return (
    <div className="absolute left-0 top-0 flex h-full w-full flex-col">
      <Header>
        <NextLink href="/info" title="Go to info page">
          <InfoIcon />
        </NextLink>
        <Logo />
        <Refresh reloadData={handleReloadData} isRefreshing={dataLoading} />
      </Header>

      <main data-test-id="index-page" className="grow bg-slate-700">
        <DynamicMap
          webcamData={webcamData}
          temperatureData={tempData}
          windData={localWindData}
          mapboxUrl={mapboxUrl}
          center={center ?? undefined}
          refreshQuery={refreshQuery}
          isWindVisible={isWindVisible}
          isTemperatureVisible={isTemperatureVisible}
          isWebcamsVisible={isWebcamsVisible}
        />
      </main>
    </div>
  );
};
