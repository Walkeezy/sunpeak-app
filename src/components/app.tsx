'use client';

import NextLink from 'next/link';
import { FC, useState } from 'react';
import { TemperatureData } from '../services/weatherData';
import { WebcamData } from '../services/webcamData';
import { generateRefreshQuery } from '../utils/generateRefreshQuery';
import { Header } from './header';
import { InfoIcon } from './icons/info';
import { Logo } from './logo';
import { Map } from './map';
import { Refresh } from './refresh';

type Props = {
  mapboxUrl: string;
  webcamData: WebcamData;
  temperatureData: TemperatureData;
  center?: { centerLat: string; centerLon: string; zoom: string };
};

export const App: FC<Props> = ({ mapboxUrl, webcamData, temperatureData, center }) => {
  const [dataLoading, setDataLoading] = useState(false);
  const [tempData, setTempData] = useState(temperatureData);
  const [refreshQuery, setRefreshQuery] = useState<string>(generateRefreshQuery());

  const handleReloadData = async () => {
    try {
      setDataLoading(true);
      setRefreshQuery(new Date().getTime().toString());
      const response = await fetch('/api/data');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data: { temperatureData: TemperatureData } = await response.json();
      setTempData(data.temperatureData);
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
        <Map
          webcamData={webcamData}
          temperatureData={tempData}
          mapboxUrl={mapboxUrl}
          center={center ?? undefined}
          refreshQuery={refreshQuery}
        />
      </main>
    </div>
  );
};
