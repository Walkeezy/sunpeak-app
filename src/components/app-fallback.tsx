'use client';

import type { FC } from 'react';
import { useMessages } from '@/i18n/messages-provider';
import { iconButtonClasses } from './icon-button';
import { RefreshIcon } from './icons/refresh';
import { LoadingMap } from './loading-map';
import { Shell } from './shell';

// Streamed while the sources load; mirrors the app's header so the swap is seamless
export const AppFallback: FC = () => {
  const { app } = useMessages();

  return (
    <Shell
      actions={
        <button type="button" className={iconButtonClasses} disabled title={app.refresh} aria-label={app.refresh}>
          <span className="flex">
            <RefreshIcon />
          </span>
        </button>
      }
    >
      <LoadingMap />
    </Shell>
  );
};
