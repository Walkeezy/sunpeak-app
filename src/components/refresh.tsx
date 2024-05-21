'use client';

import { FC } from 'react';
import { joinClasses } from '../utils/joinClasses';
import { RefreshIcon } from './icons/refresh';

type Props = {
  reloadData: () => void;
  isRefreshing: boolean;
};

export const Refresh: FC<Props> = ({ reloadData, isRefreshing }) => (
  <button
    data-test-id="refresh-button"
    className={joinClasses([isRefreshing && 'animate-spin'])}
    onClick={reloadData}
    title="Refresh webcam data"
  >
    <RefreshIcon />
  </button>
);
