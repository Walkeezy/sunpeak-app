'use client';

import dynamic from 'next/dynamic';
import { type FC, Suspense, useCallback, useEffect, useState, useTransition } from 'react';
import { type RefreshTrigger, useAutoRefresh } from '@/hooks/useAutoRefresh';
import { fill } from '@/i18n/format';
import { useMessages } from '@/i18n/messages-provider';
import type { LayerVisibility } from '@/layers';
import { getData } from '@/services/actions';
import type { SourceData } from '@/services/sourceData';
import { dataLoadErrorMessage } from '@/utils/dataLoadErrorMessage';
import { generateRefreshQuery } from '@/utils/generateRefreshQuery';
import type { MapCenter } from '@/utils/parseMapCenter';
import { latestMeasurement } from '@/utils/shouldRefresh';
import { formatMeasurementTime } from '@/utils/temperatureLabel';
import { DataStatusBanner } from './data-status-banner';
import { iconButtonClasses } from './icon-button';
import { SearchIcon } from './icons/search';
import { InitialData } from './initial-data';
import { LoadingMap } from './loading-map';
import { Refresh } from './refresh';
import { Shell } from './shell';

type Status = { kind: 'error' | 'success'; message: string };

type Props = {
  sources: Promise<SourceData>;
  center?: MapCenter;
  layers: LayerVisibility;
  minAltitude: number;
  // Slug from /?cam=…: the map opens with this webcam's overlay
  initialCamSlug?: string;
};

const DynamicMap = dynamic(() => import('@/components/map').then((module) => module.WebcamMap), {
  loading: () => <LoadingMap />,
  ssr: false,
});

const NO_DATA: Pick<SourceData, 'webcamData' | 'temperatureData' | 'windData' | 'sunshineData'> = {
  webcamData: [],
  temperatureData: [],
  windData: [],
  sunshineData: [],
};

// Typing into a field must not open the search, and neither should a key pressed in an open webcam
const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

const isModalOpen = () => document.querySelector('[aria-modal="true"]') !== null;

export const App: FC<Props> = ({ sources, center, layers, minAltitude, initialCamSlug }) => {
  const { app: t } = useMessages();
  // Undefined until the sources have loaded; the map shows its tiles meanwhile
  const [data, setData] = useState<SourceData | undefined>(undefined);
  const [isRefreshing, startRefresh] = useTransition();
  const [refreshQuery, setRefreshQuery] = useState(generateRefreshQuery);
  const [status, setStatus] = useState<Status | null>(null);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const dismissStatus = useCallback(() => setStatus(null), []);
  const showLocationError = useCallback(() => setStatus({ kind: 'error', message: t.locationFailed }), [t.locationFailed]);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const receiveInitialData = useCallback(
    (initial: SourceData) => {
      setData(initial);

      const message = dataLoadErrorMessage(initial, t.loadErrors);

      if (message) {
        setStatus({ kind: 'error', message });
      }
    },
    [t.loadErrors],
  );

  // A manual refresh or coming back to the app confirms with the measurement time; the ten-minute refresh
  // happens quietly unless something fails
  const handleReloadData = useCallback(
    (trigger: RefreshTrigger) => {
      startRefresh(async () => {
        // Refresh the images even if the data request fails
        setRefreshQuery(Date.now().toString());

        try {
          const fresh = await getData();

          // Updates after an await need their own startTransition to join the pending one
          startRefresh(() => {
            // A source that failed keeps its previous values
            setData((previous) => ({
              ...fresh,
              webcamData: fresh.webcamOk ? fresh.webcamData : (previous?.webcamData ?? []),
              temperatureData: fresh.temperatureOk ? fresh.temperatureData : (previous?.temperatureData ?? []),
              windData: fresh.windOk ? fresh.windData : (previous?.windData ?? []),
              sunshineData: fresh.sunshineOk ? fresh.sunshineData : (previous?.sunshineData ?? []),
            }));

            const message = dataLoadErrorMessage(fresh, t.loadErrors);
            const time = formatMeasurementTime(latestMeasurement(fresh.temperatureData));

            if (message) {
              setStatus({ kind: 'error', message });
            } else if (trigger !== 'interval') {
              setStatus({ kind: 'success', message: time ? fill(t.updatedAt, { time }) : t.updated });
            }
          });
        } catch (error) {
          console.error(error);
          startRefresh(() => setStatus({ kind: 'error', message: t.loadFailed }));
        }
      });
    },
    [t],
  );

  const refreshNow = useAutoRefresh(handleReloadData, isRefreshing);
  const refreshManually = useCallback(() => refreshNow('manual'), [refreshNow]);

  const hasData = data !== undefined;

  // "/" opens the search, as on many sites with a map or a list
  useEffect(() => {
    if (!hasData) {
      return;
    }

    const openSearchOnSlash = (event: KeyboardEvent) => {
      if (
        event.key !== '/' ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isTypingTarget(event.target) ||
        isModalOpen()
      ) {
        return;
      }

      event.preventDefault();
      setSearchOpen(true);
    };

    window.addEventListener('keydown', openSearchOnSlash);

    return () => window.removeEventListener('keydown', openSearchOnSlash);
  }, [hasData]);

  const measurementTime = formatMeasurementTime(latestMeasurement(data?.temperatureData ?? []));

  return (
    <Shell
      actions={
        <>
          <Refresh reloadData={refreshManually} isRefreshing={isRefreshing || !hasData} time={measurementTime} />
          {/* The search panel leaves this button out of its "tap outside closes" rule, so it can toggle */}
          <button
            type="button"
            data-test-id="search-button"
            data-search-toggle
            className={iconButtonClasses}
            onClick={() => setSearchOpen((open) => !open)}
            disabled={!hasData}
            aria-expanded={isSearchOpen}
            aria-keyshortcuts="/"
            title={t.search}
            aria-label={t.search}
          >
            <SearchIcon />
          </button>
        </>
      }
      banner={
        hasData
          ? status && (
              <DataStatusBanner
                key={`${status.kind}-${status.message}`}
                kind={status.kind}
                message={status.message}
                onDismiss={dismissStatus}
              />
            )
          : // Only while the first data is on its way; an error replaces it
            !status && <DataStatusBanner kind="loading" message={t.loading} />
      }
    >
      <Suspense fallback={null}>
        <InitialData sources={sources} onLoaded={receiveInitialData} />
      </Suspense>
      <DynamicMap
        {...(data ?? NO_DATA)}
        center={center}
        initialCamSlug={initialCamSlug}
        refreshQuery={refreshQuery}
        layers={layers}
        minAltitude={minAltitude}
        isSearchOpen={isSearchOpen}
        onSearchClose={closeSearch}
        onLocationError={showLocationError}
      />
    </Shell>
  );
};
