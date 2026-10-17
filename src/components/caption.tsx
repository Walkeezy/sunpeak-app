'use client';

import type { FC } from 'react';
import { fill } from '@/i18n/format';
import { useLocale, useMessages } from '@/i18n/messages-provider';
import { webcamSubtitle } from '@/utils/webcamSubtitle';
import { iconButtonClasses } from './icon-button';
import { LinkIcon } from './icons/link';

type Props = {
  name: string;
  city: string;
  link: string;
  altitude?: number;
};

// Name over town, quiet on the dimmed map; the yellow link icon is the only accent
export const Caption: FC<Props> = ({ name, city, link, altitude }) => {
  const { app } = useMessages();
  const locale = useLocale();
  const details = webcamSubtitle({ city, altitude }, app.webcamAltitude, locale);

  return (
    <div className="text-firn mt-3 flex items-center justify-center gap-2">
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="signage truncate text-lg">{name}</span>
        {details && <span className="text-firn/70 truncate text-sm">{details}</span>}
      </span>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={fill(app.openWebcamSite, { name })}
        className={`${iconButtonClasses} text-sonne`}
      >
        <LinkIcon />
      </a>
    </div>
  );
};
