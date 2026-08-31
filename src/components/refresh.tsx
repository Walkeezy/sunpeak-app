'use client';

import type { FC } from 'react';
import { joinClasses } from '@/utils/joinClasses';
import { RefreshIcon } from './icons/refresh';

type Props = {
  reloadData: () => void;
  isRefreshing: boolean;
};

export const Refresh: FC<Props> = ({ reloadData, isRefreshing }) => (
  <button
    type="button"
    data-test-id="refresh-button"
    className={joinClasses([isRefreshing && 'animate-spin'])}
    onClick={reloadData}
    disabled={isRefreshing}
    title="Refresh data"
    aria-label="Refresh data"
    aria-busy={isRefreshing}
  >
    <RefreshIcon />
  </button>
);
