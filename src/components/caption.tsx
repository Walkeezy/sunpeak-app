import { FC } from 'react';
import { LinkIcon } from './icons/link';

type Props = {
  name: string;
  link: string;
};

export const Caption: FC<Props> = ({ name, link }) => (
  <span className="absolute -bottom-10 left-1/2 flex -translate-x-1/2 gap-1">
    <span className="rounded-sm bg-white px-2 py-1 text-base whitespace-nowrap shadow-md">{name}</span>
    <span className="flex items-center justify-center rounded-sm bg-white px-2 py-1 text-sm shadow-md">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <LinkIcon />
      </a>
    </span>
  </span>
);
