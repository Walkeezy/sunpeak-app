'use client';

import type { FC } from 'react';
import { fill } from '@/i18n/format';
import { useMessages } from '@/i18n/messages-provider';
import { joinClasses } from '@/utils/joinClasses';
import { RefreshIcon } from './icons/refresh';

type Props = {
  reloadData: () => void;
  isRefreshing: boolean;
  // Swiss local time of the newest measurement, shown so the freshness of the data is never in question
  time?: string;
};

export const Refresh: FC<Props> = ({ reloadData, isRefreshing, time }) => {
  const { app } = useMessages();
  const label = time ? `${app.refresh}. ${fill(app.measurementsFrom, { time })}` : app.refresh;

  return (
    <button
      type="button"
      data-test-id="refresh-button"
      className="hover:bg-firn/10 flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 transition-colors disabled:hover:bg-transparent"
      onClick={reloadData}
      disabled={isRefreshing}
      title={label}
      aria-label={label}
      aria-busy={isRefreshing}
    >
      <span className={joinClasses(['flex', isRefreshing && 'motion-safe:animate-spin'])}>
        <RefreshIcon />
      </span>
      {time && <span className="signage text-xs sm:text-sm">{time}</span>}
    </button>
  );
};
