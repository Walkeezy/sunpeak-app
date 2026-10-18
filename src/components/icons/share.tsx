import type { FC } from 'react';
import type { IconProps } from '@/types';

// A box with an arrow out of it, as the share sheets draw it
export const ShareIcon: FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 3v12M8 7l4-4 4 4" />
    <path d="M6 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8" />
  </svg>
);
