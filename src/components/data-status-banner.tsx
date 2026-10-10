'use client';

import { type FC, useEffect } from 'react';
import { joinClasses } from '@/utils/joinClasses';
import { CloseIcon } from './icons/close';

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
        'on-light text-tinte signage flex min-h-10 shrink-0 items-center justify-between gap-2 py-1 pr-1 pl-4 text-sm',
        kind === 'error' ? 'bg-sonne' : 'bg-firn',
      ])}
    >
      <span>{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="hover:bg-tinte/10 flex size-9 shrink-0 items-center justify-center rounded-md"
      >
        <CloseIcon size={16} />
      </button>
    </div>
  );
};
