import type { FC } from 'react';

type Props = {
  as?: 'h1' | 'span';
};

export const Logo: FC<Props> = ({ as: TitleTag = 'h1' }) => (
  <div className="text-sonne flex items-center gap-2 px-2">
    <svg aria-hidden="true" width="32" height="19" viewBox="0 0 851 495" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M381 469H781L621 141C617 134 612 127 605 123C598 118 589 116 581 116C573 116 565 118 557 123C550 127 545 134 541 141L381 469ZM381 469H69L297 48C301 41 307 35 314 31C321 27 328 25 336 25C344 25 352 27 359 31C366 35 372 41 376 48L486 253L381 469ZM25 469H826"
        stroke="currentColor"
        strokeWidth="50"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <TitleTag className="signage text-[22px] leading-none">Sunpeak</TitleTag>
  </div>
);
