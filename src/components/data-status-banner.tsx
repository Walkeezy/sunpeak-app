'use client';

import { type FC, useEffect } from 'react';
import { useMessages } from '@/i18n/messages-provider';
import { joinClasses } from '@/utils/joinClasses';
import { CheckIcon } from './icons/check';
import { CloseIcon } from './icons/close';
import { LoadingIcon } from './icons/loading';
import { WarningIcon } from './icons/warning';

type Kind = 'error' | 'success' | 'loading';

type Props = {
  kind: Kind;
  message: string;
  // Without it the toast can't be closed, e.g. while the first data loads
  onDismiss?: () => void;
};

// Errors in alpenglow red, everything else on snow: the sun's yellow stays with the sun
const styles: Record<Kind, { toast: string; dismiss: string; icon: FC }> = {
  error: { toast: 'bg-glut text-firn', dismiss: 'hover:bg-firn/15', icon: () => <WarningIcon size={18} /> },
  success: { toast: 'on-light bg-firn text-tinte', dismiss: 'hover:bg-tinte/10', icon: () => <CheckIcon size={18} /> },
  loading: { toast: 'on-light bg-firn text-tinte', dismiss: 'hover:bg-tinte/10', icon: () => <LoadingIcon size={18} /> },
};

// Floats over the map instead of pushing it down, so a message never moves the view
export const DataStatusBanner: FC<Props> = ({ kind, message, onDismiss }) => {
  const { app } = useMessages();
  const { toast, dismiss, icon: Icon } = styles[kind];

  useEffect(() => {
    if (kind !== 'success' || !onDismiss) {
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
        'signage motion-safe:animate-rise pointer-events-auto flex min-h-11 w-full max-w-md items-center gap-3 rounded-lg py-1.5 pl-3.5 text-sm shadow-lg',
        onDismiss ? 'pr-1.5' : 'pr-4',
        toast,
      ])}
    >
      <span className="flex shrink-0">
        <Icon />
      </span>
      <span className="grow">{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={app.dismiss}
          className={joinClasses(['flex size-9 shrink-0 items-center justify-center rounded-md', dismiss])}
        >
          <CloseIcon size={16} />
        </button>
      )}
    </div>
  );
};
