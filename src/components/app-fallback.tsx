import type { FC } from 'react';
import { iconButtonClasses } from './icon-button';
import { RefreshIcon } from './icons/refresh';
import { LoadingMap } from './loading-map';
import { Shell } from './shell';

// Streamed while the sources load; mirrors the app's header so the swap is seamless
export const AppFallback: FC = () => (
  <Shell
    actions={
      <button type="button" className={iconButtonClasses} disabled title="Refresh data" aria-label="Refresh data">
        <span className="flex">
          <RefreshIcon />
        </span>
      </button>
    }
  >
    <LoadingMap />
  </Shell>
);
