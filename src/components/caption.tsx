import type { FC } from 'react';
import { LinkIcon } from './icons/link';

type Props = {
  name: string;
  city: string;
  link: string;
};

// A Wanderweg signpost: the place on the plate, the pointed end leads off the app to the webcam's own site
export const Caption: FC<Props> = ({ name, city, link }) => (
  <div className="mt-3 flex justify-center">
    <div className="signpost on-light bg-sonne text-tinte flex max-w-full">
      <span className="flex min-w-0 flex-col justify-center py-2 pr-3 pl-4 leading-tight">
        <span className="signage truncate text-lg">{name}</span>
        {city && <span className="truncate text-sm font-medium">{city}</span>}
      </span>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${name} on the webcam's site`}
        className="border-tinte/20 hover:bg-tinte/10 flex items-center border-l py-2 pr-7 pl-3 transition-colors focus-visible:outline-offset-[-3px]"
      >
        <LinkIcon />
      </a>
    </div>
  </div>
);
