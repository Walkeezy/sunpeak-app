'use client';

import { type FC, useState } from 'react';
import { ALTITUDE_STEPS } from '@/config';
import { fill } from '@/i18n/format';
import { useLocale, useMessages } from '@/i18n/messages-provider';
import { formatAltitude } from '@/utils/formatAltitude';
import { joinClasses } from '@/utils/joinClasses';

type Props = {
  value: number;
  onChange: (altitude: number) => void;
};

const MountainGlyph: FC = () => (
  <svg aria-hidden="true" width="22" height="13" viewBox="0 0 851 495" fill="none" className="shrink-0">
    <path
      d="M381 469H781L621 141C617 134 612 127 605 123C598 118 589 116 581 116C573 116 565 118 557 123C550 127 545 134 541 141L381 469ZM381 469H69L297 48C301 41 307 35 314 31C321 27 328 25 336 25C344 25 352 27 359 31C366 35 372 41 376 48L486 253L381 469ZM25 469H826"
      stroke="currentColor"
      strokeWidth="60"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Hides webcams and stations below the chosen altitude, e.g. to look above the fog. On phones it folds to the
// mountain and the current step until tapped, so the map keeps its bottom edge; from the small breakpoint
// up the whole row is always there
export const AltitudeFilter: FC<Props> = ({ value, onChange }) => {
  const { app } = useMessages();
  const locale = useLocale();
  const [isExpanded, setExpanded] = useState(false);

  return (
    <fieldset className="on-light bg-firn text-tinte flex items-center gap-1 rounded-lg p-1 shadow-md">
      <legend className="sr-only">{app.altitudeLegend}</legend>
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-label={app.altitudeLegend}
        onClick={() => setExpanded((expanded) => !expanded)}
        className="text-tinte/70 hover:bg-tinte/10 flex h-9 items-center rounded-md px-1.5 sm:hidden"
      >
        <MountainGlyph />
      </button>
      <span aria-hidden="true" className="text-tinte/70 mx-1.5 hidden sm:flex">
        <MountainGlyph />
      </span>
      {ALTITUDE_STEPS.map((step) => {
        const isOn = step === value;
        const altitude = formatAltitude(step, locale);

        return (
          <button
            key={step}
            type="button"
            aria-pressed={isOn}
            aria-label={step === 0 ? app.altitudeAllLabel : fill(app.altitudeFrom, { altitude })}
            data-test-id={`altitude-${step}`}
            onClick={() => {
              // Folded, the current step is the handle that opens the row
              if (isOn) {
                setExpanded(true);
              } else {
                onChange(step);
                setExpanded(false);
              }
            }}
            className={joinClasses([
              'signage h-9 items-center rounded-md px-2.5 text-sm transition-colors',
              isOn || isExpanded ? 'flex' : 'hidden sm:flex',
              isOn ? 'bg-tinte text-firn' : 'text-tinte/70 hover:bg-tinte/10',
            ])}
          >
            {step === 0 ? app.altitudeAll : fill(app.altitudeStep, { altitude })}
          </button>
        );
      })}
    </fieldset>
  );
};
