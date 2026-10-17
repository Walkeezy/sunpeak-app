import type { FC } from 'react';
import type { IconProps } from '@/types';

// Four tiles, for the list of all webcams
export const WebcamsIcon: FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 514 514" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M58 58H222V222H58V58ZM292 58H456V222H292V58ZM58 292H222V456H58V292ZM292 292H456V456H292V292Z"
      stroke={color}
      strokeWidth="45"
      strokeLinejoin="round"
    />
  </svg>
);
