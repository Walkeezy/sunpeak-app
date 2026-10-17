'use client';

import dynamic from 'next/dynamic';
import { type FC, use, useCallback, useState, useTransition } from 'react';
import { useMessages } from '@/i18n/messages-provider';
import type { LayerVisibility } from '@/layers';
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
  center?: MapCenter;
  layers: LayerVisibility;
  // Slug from /?cam=…: the map opens with this webcam's overlay
  initialCamSlug?: string;
};

const DynamicMap = dynamic(() => import('@/components/map').then((module) => module.WebcamMap), {
  loading: () => <LoadingMap />,
  ssr: false,
});

export const App: FC<Props> = ({ sources, center, layers, initialCamSlug }) => {
  // Suspends until the sources are loaded; page.tsx shows the shell with a loading map meanwhile
  const { webcamData, temperatureData, windData, sunshineData, webcamOk, temperatureOk, windOk, sunshineOk } = use(sources);
  const { app: t } = useMessages();
  // Resolved once from the URL the page was opened with; later opens and closes are handled by the map itself
  const [initialCam] = useState(() =>
    initialCamSlug ? webcamData.find((webcam) => webcam.slug === initialCamSlug) : undefined,
  );
  const [isRefreshing, startRefresh] = useTransition();
  const [webcams, setWebcams] = useState(webcamData);
  const [temperatures, setTemperatures] = useState(temperatureData);
  const [winds, setWinds] = useState(windData);
  const [sunshine, setSunshine] = useState(sunshineData);
  const [refreshQuery, setRefreshQuery] = useState(generateRefreshQuery);
  const [status, setStatus] = useState<Status | null>(() => {
    const message = dataLoadErrorMessage({ webcamOk, temperatureOk, windOk, sunshineOk }, t.loadErrors);

    return message ? { kind: 'error', message } : null;
  });

  const dismissStatus = useCallback(() => setStatus(null), []);
  const showLocationError = useCallback(() => setStatus({ kind: 'error', message: t.locationFailed }), [t.locationFailed]);

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

          if (data.sunshineOk) {
            setSunshine(data.sunshineData);
          }

          const message = dataLoadErrorMessage(data, t.loadErrors);
          setStatus(message ? { kind: 'error', message } : { kind: 'success', message: t.updated });
        });
      } catch (error) {
        console.error(error);
        startRefresh(() => setStatus({ kind: 'error', message: t.loadFailed }));
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
        sunshineData={sunshine}
        center={center}
        initialCam={initialCam}
        refreshQuery={refreshQuery}
        layers={layers}
        onLocationError={showLocationError}
      />
    </Shell>
  );
};
