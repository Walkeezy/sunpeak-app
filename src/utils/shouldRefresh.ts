// MeteoSwiss publishes every ten minutes, and webcams update every few minutes
export const REFRESH_INTERVAL_MS = 10 * 60 * 1000;
// Coming back to the tab after this long reloads right away
export const STALE_AFTER_MS = 5 * 60 * 1000;

export const shouldRefresh = (lastRefreshAt: number, now: number, staleAfterMs: number): boolean =>
  now - lastRefreshAt >= staleAfterMs;

// The newest measurement time, to tell visitors how fresh the weather data is
export const latestMeasurement = (measurements: { measuredAt?: string }[]): string | undefined =>
  measurements.reduce<string | undefined>(
    (latest, { measuredAt }) => (measuredAt && (!latest || measuredAt > latest) ? measuredAt : latest),
    undefined,
  );
