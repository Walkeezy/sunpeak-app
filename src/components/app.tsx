'use client';

import dynamic from 'next/dynamic';
import { type FC, use, useCallback, useState, useTransition } from 'react';
import { getData } from '@/services/actions';
import type { SourceData } from '@/services/sourceData';
import { dataLoadErrorMessage } from '@/utils/dataLoadErrorMessage';
import { generateRefreshQuery } from '@/utils/generateRefreshQuery';
import type { MapCenter } from '@/utils/parseMapCenter';
import { DataStatusBanner } from './data-status-banner';
import { LoadingMap } from './loading-map';
import { Refresh } from './refresh';
import { Shell } from './shell';

type Status = { kind: 'error' | 'success'; message: string };

type Props = {
  sources: Promise<SourceData>;
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

export const App: FC<Props> = ({ sources, mapboxUrl, center, isWindVisible, isTemperatureVisible, isWebcamsVisible }) => {
  // Suspends until the sources are loaded; page.tsx shows the shell with a loading map meanwhile
  const { webcamData, temperatureData, windData, webcamOk, temperatureOk, windOk } = use(sources);
  const [isRefreshing, startRefresh] = useTransition();
  const [webcams, setWebcams] = useState(webcamData);
  const [temperatures, setTemperatures] = useState(temperatureData);
  const [winds, setWinds] = useState(windData);
  const [refreshQuery, setRefreshQuery] = useState(generateRefreshQuery);
  const [status, setStatus] = useState<Status | null>(() => {
    const message = dataLoadErrorMessage({ webcamOk, temperatureOk, windOk });

    return message ? { kind: 'error', message } : null;
  });

  const dismissStatus = useCallback(() => setStatus(null), []);
  const showLocationError = useCallback(
    () => setStatus({ kind: 'error', message: 'Your location could not be determined' }),
    [],
  );

  const handleReloadData = () => {
    startRefresh(async () => {
      // Refresh the images even if the data request fails
      setRefreshQuery(Date.now().toString());

      try {
        const data = await getData();

        // Updates after an await need their own startTransition to join the pending one
        startRefresh(() => {
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
        });
      } catch (error) {
        console.error(error);
        startRefresh(() => setStatus({ kind: 'error', message: 'Data could not be loaded' }));
      }
    });
  };

  return (
    <Shell
      actions={<Refresh reloadData={handleReloadData} isRefreshing={isRefreshing} />}
      banner={
        status && (
          <DataStatusBanner
            key={`${status.kind}-${status.message}`}
            kind={status.kind}
            message={status.message}
            onDismiss={dismissStatus}
          />
        )
      }
    >
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
        onLocationError={showLocationError}
      />
    </Shell>
  );
};
