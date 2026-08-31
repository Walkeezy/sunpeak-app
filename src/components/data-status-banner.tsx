'use client';

import { type FC, useEffect } from 'react';
import { joinClasses } from '@/utils/joinClasses';

type Props = {
  kind: 'error' | 'success';
  message: string;
  onDismiss: () => void;
};

export const DataStatusBanner: FC<Props> = ({ kind, message, onDismiss }) => {
  useEffect(() => {
    if (kind !== 'success') {
      return;
    }

    const timeout = setTimeout(onDismiss, 2000);

    return () => clearTimeout(timeout);
  }, [kind, onDismiss]);

  return (
    <div
      role={kind === 'error' ? 'alert' : 'status'}
      data-test-id="data-status-banner"
      className={joinClasses([
        'text-slate flex shrink-0 items-center justify-between gap-2 px-4 py-1 text-sm',
        kind === 'error' ? 'bg-yellow' : 'bg-white',
      ])}
    >
      <span>{message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
};
