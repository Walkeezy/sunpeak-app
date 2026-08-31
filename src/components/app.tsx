'use client';

import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { type FC, useCallback, useState } from 'react';
import { getData } from '@/services/actions';
import type { TemperatureData } from '@/services/temperatureData';
import type { WebcamData } from '@/services/webcamData';
import type { WindData } from '@/services/windData';
import { dataLoadErrorMessage } from '@/utils/dataLoadErrorMessage';
import { generateRefreshQuery } from '@/utils/generateRefreshQuery';
import { DataStatusBanner } from './data-status-banner';
import { Header } from './header';
import { InfoIcon } from './icons/info';
import { LoadingMap } from './loading-map';
import { Logo } from './logo';
import { Refresh } from './refresh';

type Status = { kind: 'error' | 'success'; message: string };

type Props = {
  mapboxUrl: string;
  webcamData: WebcamData;
  temperatureData: TemperatureData;
  windData: WindData;
  webcamOk: boolean;
  temperatureOk: boolean;
  windOk: boolean;
  center?: { centerLat: string; centerLon: string; zoom: string };
  isWindVisible: boolean;
  isTemperatureVisible: boolean;
  isWebcamsVisible: boolean;
};

const DynamicMap = dynamic(() => import('@/components/map').then((module) => module.WebcamMap), {
  loading: () => <LoadingMap />,
  ssr: false,
});

export const App: FC<Props> = ({
  mapboxUrl,
  webcamData,
  temperatureData,
  windData,
  webcamOk,
  temperatureOk,
  windOk,
  center,
  isWindVisible,
  isTemperatureVisible,
  isWebcamsVisible,
}) => {
  const [dataLoading, setDataLoading] = useState(false);
  const [localWebcamData, setWebcamData] = useState(webcamData);
  const [tempData, setTempData] = useState(temperatureData);
  const [localWindData, setWindData] = useState(windData);
  const [refreshQuery, setRefreshQuery] = useState<string>(generateRefreshQuery());
  const [status, setStatus] = useState<Status | null>(() => {
    const message = dataLoadErrorMessage(webcamOk, temperatureOk, windOk);

    return message ? { kind: 'error', message } : null;
  });

  const dismissStatus = useCallback(() => setStatus(null), []);

  const handleReloadData = async () => {
    setDataLoading(true);

    try {
      setRefreshQuery(Date.now().toString());
      const data = await getData();

      if (data.webcamOk) {
        setWebcamData(data.webcamData);
      }

      if (data.temperatureOk) {
        setTempData(data.temperatureData);
      }

      if (data.windOk) {
        setWindData(data.windData);
      }

      const message = dataLoadErrorMessage(data.webcamOk, data.temperatureOk, data.windOk);
      setStatus(message ? { kind: 'error', message } : { kind: 'success', message: 'Updated' });
    } catch (error) {
      console.error(error);
      setStatus({ kind: 'error', message: 'Data could not be loaded' });
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <div className="absolute top-0 left-0 flex h-full w-full flex-col">
      <Header>
        <NextLink href="/info" title="Go to info page">
          <InfoIcon />
        </NextLink>
        <Logo />
        <Refresh reloadData={handleReloadData} isRefreshing={dataLoading} />
      </Header>

      {status && (
        <DataStatusBanner
          key={`${status.kind}-${status.message}`}
          kind={status.kind}
          message={status.message}
          onDismiss={dismissStatus}
        />
      )}

      <main data-test-id="index-page" className="bg-slate grow">
        <DynamicMap
          webcamData={localWebcamData}
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
