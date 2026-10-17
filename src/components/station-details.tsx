'use client';

import type { FC } from 'react';
import { fill } from '@/i18n/format';
import { useLocale, useMessages } from '@/i18n/messages-provider';
import type { Station } from '@/services/stationData';
import { compassDirection } from '@/utils/compassDirection';
import { formatAltitude } from '@/utils/formatAltitude';
import { formatMeasurementTime } from '@/utils/temperatureLabel';
import { CloseIcon } from './icons/close';

type Props = {
  station: Station;
  onClose: () => void;
};

// Content of a weather station's popup: everything the station measured, readable on touch screens
export const StationDetails: FC<Props> = ({ station, onClose }) => {
  const { station: t } = useMessages();
  const locale = useLocale();
  const numberLocale = locale === 'de' ? 'de-CH' : 'en-GB';
  const decimal = new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 1 });
  const integer = new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 0 });
  const time = formatMeasurementTime(station.measuredAt);
  const { altitude, temperature, sunshine, gust, direction } = station;

  return (
    <div data-test-id="station-details" className="on-light text-tinte min-w-44">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="signage text-base leading-tight">{station.name ?? t.fallbackName}</p>
          {altitude !== undefined && (
            <p className="text-tinte/70 text-sm">{fill(t.altitude, { altitude: formatAltitude(altitude, locale) })}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="hover:bg-tinte/10 -mt-2 -mr-2 flex size-9 shrink-0 items-center justify-center rounded-md"
        >
          <CloseIcon size={14} />
        </button>
      </div>

      <dl className="mt-2 space-y-0.5 text-sm">
        {temperature !== undefined && (
          <div className="flex justify-between gap-4">
            <dt>{t.temperature}</dt>
            <dd className="signage">{decimal.format(temperature)} °C</dd>
          </div>
        )}
        {sunshine !== undefined && (
          <div className="flex justify-between gap-4">
            <dt>{t.sunshine}</dt>
            <dd className="signage">{fill(t.sunshineMinutes, { minutes: sunshine })}</dd>
          </div>
        )}
        {gust !== undefined && (
          <div className="flex justify-between gap-4">
            <dt>{t.gusts}</dt>
            <dd className="signage text-right">
              {direction === undefined
                ? fill(t.gustSpeed, { speed: integer.format(gust) })
                : fill(t.gustFrom, { speed: integer.format(gust), direction: t.compass[compassDirection(direction)] })}
            </dd>
          </div>
        )}
      </dl>

      {time && <p className="text-tinte/60 mt-2 text-xs">{fill(t.measuredAt, { time })}</p>}
    </div>
  );
};
