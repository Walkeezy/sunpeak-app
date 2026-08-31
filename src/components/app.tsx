'use client';

import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { type FC, useCallback, useState } from 'react';
import { getData } from '@/services/actions';
import type { SourceData } from '@/services/sourceData';
import { dataLoadErrorMessage } from '@/utils/dataLoadErrorMessage';
import { generateRefreshQuery } from '@/utils/generateRefreshQuery';
import type { MapCenter } from '@/utils/parseMapCenter';
import { DataStatusBanner } from './data-status-banner';
import { Header } from './header';
import { InfoIcon } from './icons/info';
import { LoadingMap } from './loading-map';
import { Logo } from './logo';
import { Refresh } from './refresh';

type Status = { kind: 'error' | 'success'; message: string };

type Props = SourceData & {
  mapboxUrl: string;
  center?: MapCenter;
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
  const [webcams, setWebcams] = useState(webcamData);
  const [temperatures, setTemperatures] = useState(temperatureData);
  const [winds, setWinds] = useState(windData);
  const [refreshQuery, setRefreshQuery] = useState<string>(generateRefreshQuery());
  const [status, setStatus] = useState<Status | null>(() => {
    const message = dataLoadErrorMessage({ webcamOk, temperatureOk, windOk });

    return message ? { kind: 'error', message } : null;
  });

  const dismissStatus = useCallback(() => setStatus(null), []);

  const handleReloadData = async () => {
    setDataLoading(true);

    try {
      setRefreshQuery(Date.now().toString());
      const data = await getData();

      if (data.webcamOk) {
        setWebcams(data.webcamData);
      }

      if (data.temperatureOk) {
        setTemperatures(data.temperatureData);
      }

      if (data.windOk) {
        setWinds(data.windData);
      }

      const message = dataLoadErrorMessage(data);
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
          webcamData={webcams}
          temperatureData={temperatures}
          windData={winds}
          mapboxUrl={mapboxUrl}
          center={center}
          refreshQuery={refreshQuery}
          isWindVisible={isWindVisible}
          isTemperatureVisible={isTemperatureVisible}
          isWebcamsVisible={isWebcamsVisible}
        />
      </main>
    </div>
  );
};
