'use client';

import type { FC } from 'react';
import { fill } from '@/i18n/format';
import { useLocale, useMessages } from '@/i18n/messages-provider';
import { altitudeStepFor, type FogBoundary } from '@/utils/fogBoundary';
import { formatAltitude } from '@/utils/formatAltitude';
import { joinClasses } from '@/utils/joinClasses';

type Props = {
  boundary: FogBoundary;
  minAltitude: number;
  onChange: (altitude: number) => void;
};

// The estimated fog line; a tap filters the map to what lies above it, a second tap shows everything again
export const FogHint: FC<Props> = ({ boundary, minAltitude, onChange }) => {
  const { app } = useMessages();
  const locale = useLocale();
  const step = altitudeStepFor(boundary.altitude);
  const isOn = minAltitude === step;
  const text = fill(boundary.kind === 'sun' ? app.fogSun : app.fogInversion, {
    altitude: formatAltitude(boundary.altitude, locale),
  });

  return (
    <button
      type="button"
      aria-pressed={isOn}
      title={fill(app.fogAction, { altitude: formatAltitude(step, locale) })}
      data-test-id="fog-hint"
      onClick={() => onChange(isOn ? 0 : step)}
      className={joinClasses([
        'on-light signage flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm shadow-md transition-colors',
        isOn ? 'bg-tinte text-sonne' : 'bg-sonne text-tinte hover:bg-firn',
      ])}
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* A sun over a fog bank */}
        <circle cx="8" cy="6" r="2.75" fill="currentColor" stroke="none" />
        <path strokeLinecap="round" d="M2 11.5h12M4 14h8M8 0.75v1.5M2.6 2.6l1.06 1.06M13.4 2.6l-1.06 1.06" />
      </svg>
      {text}
    </button>
  );
};
