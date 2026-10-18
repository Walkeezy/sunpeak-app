'use client';

import NextLink from 'next/link';
import { type FC, useEffect, useState } from 'react';
import { SITE_URL } from '@/config';
import { fill } from '@/i18n/format';
import { useLocale, useMessages } from '@/i18n/messages-provider';
import type { Temperature } from '@/services/temperatureData';
import type { Webcam } from '@/services/webcamData';
import { formatDistance } from '@/utils/formatDistance';
import type { NearestMeasurement } from '@/utils/nearestMeasurement';
import { webcamPagePath } from '@/utils/paths';
import { webcamSubtitle } from '@/utils/webcamSubtitle';
import { iconButtonClasses } from './icon-button';
import { CheckIcon } from './icons/check';
import { LinkIcon } from './icons/link';
import { ShareIcon } from './icons/share';

type Props = {
  webcam: Webcam;
  // The closest temperature reading, so the picture comes with a number
  nearest?: NearestMeasurement<Temperature>;
};

// Name over town and the nearest temperature, quiet on the dimmed map; the yellow link icon is the only accent.
// The name leads to the webcam's own page, the share button hands that page on
export const Caption: FC<Props> = ({ webcam, nearest }) => {
  const { app, station } = useMessages();
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const { name, city, link, altitude, slug } = webcam;
  const details = webcamSubtitle({ city, altitude }, app.webcamAltitude, locale);
  const pagePath = webcamPagePath(locale, slug);
  const temperature =
    nearest &&
    fill(app.nearestTemperature, {
      value: nearest.measurement.value,
      station: nearest.measurement.stationName ?? station.fallbackName,
      distance: formatDistance(app, nearest.distanceKm),
    });

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = setTimeout(() => setCopied(false), 2000);

    return () => clearTimeout(timeout);
  }, [copied]);

  // The system share sheet where there is one, otherwise the link goes to the clipboard
  const share = async () => {
    const url = `${SITE_URL}${pagePath}`;
    const data = { title: name, url };

    if (typeof navigator.share === 'function' && (typeof navigator.canShare !== 'function' || navigator.canShare(data))) {
      try {
        await navigator.share(data);
      } catch {
        // Closing the sheet without sharing rejects; nothing to do
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <div className="text-firn mt-3 flex w-full max-w-xl items-center justify-center gap-1">
      <span className="flex min-w-0 flex-col leading-tight">
        <NextLink
          href={pagePath}
          title={app.webcamPage}
          className="signage decoration-sonne/60 hover:decoration-sonne truncate text-lg underline decoration-2 underline-offset-4 transition-colors"
        >
          {name}
        </NextLink>
        {details && <span className="text-firn/70 truncate text-sm">{details}</span>}
        {temperature && (
          <span data-test-id="caption-temperature" className="signage truncate text-sm">
            {temperature}
          </span>
        )}
      </span>
      <span className="relative flex shrink-0">
        <button
          type="button"
          onClick={() => {
            void share();
          }}
          aria-label={app.share}
          title={app.share}
          className={iconButtonClasses}
        >
          {copied ? <CheckIcon size={18} /> : <ShareIcon size={18} />}
        </button>
        <span
          role="status"
          className={
            copied
              ? 'signage bg-firn text-tinte absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs shadow-md'
              : 'sr-only'
          }
        >
          {copied ? app.linkCopied : ''}
        </span>
      </span>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={fill(app.openWebcamSite, { name })}
        title={fill(app.openWebcamSite, { name })}
        className={`${iconButtonClasses} text-sonne shrink-0`}
      >
        <LinkIcon />
      </a>
    </div>
  );
};
