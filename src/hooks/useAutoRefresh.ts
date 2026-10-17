import { useCallback, useEffect, useEffectEvent, useRef } from 'react';
import { REFRESH_INTERVAL_MS, STALE_AFTER_MS, shouldRefresh } from '@/utils/shouldRefresh';

export type RefreshTrigger = 'manual' | 'return' | 'interval';

// Reloads the data every ten minutes while the page is visible, and right away when a visitor comes back
// to a tab or home screen app that has been in the background for a while. Returns the function for the
// manual refresh button, so a manual refresh restarts the clock too
export const useAutoRefresh = (refresh: (trigger: RefreshTrigger) => void, isRefreshing: boolean) => {
  const lastRefreshAt = useRef(0);

  const run = useCallback(
    (trigger: RefreshTrigger) => {
      lastRefreshAt.current = Date.now();
      refresh(trigger);
    },
    [refresh],
  );

  const refreshIfStale = useEffectEvent((trigger: RefreshTrigger, staleAfterMs: number) => {
    if (
      document.visibilityState === 'visible' &&
      !isRefreshing &&
      shouldRefresh(lastRefreshAt.current, Date.now(), staleAfterMs)
    ) {
      run(trigger);
    }
  });

  useEffect(() => {
    // The server rendered the data just now
    lastRefreshAt.current = Date.now();

    const onVisibilityChange = () => refreshIfStale('return', STALE_AFTER_MS);
    // Ticks a little more often than the interval, so a tick that comes just too early doesn't add ten minutes
    const timer = window.setInterval(() => refreshIfStale('interval', REFRESH_INTERVAL_MS), REFRESH_INTERVAL_MS / 4);

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  return run;
};
