import type { FC } from 'react';
import { iconButtonClasses } from './icon-button';
import { LinkIcon } from './icons/link';

type Props = {
  name: string;
  city: string;
  link: string;
};

// Name over town, quiet on the dimmed map; the yellow link icon is the only accent
export const Caption: FC<Props> = ({ name, city, link }) => (
  <div className="text-firn mt-3 flex items-center justify-center gap-2">
    <span className="flex min-w-0 flex-col leading-tight">
      <span className="signage truncate text-lg">{name}</span>
      {city && <span className="text-firn/70 truncate text-sm">{city}</span>}
    </span>
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${name} on the webcam's site`}
      className={`${iconButtonClasses} text-sonne`}
    >
      <LinkIcon />
    </a>
  </div>
);
