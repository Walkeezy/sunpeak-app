import type { FC } from 'react';
import type { IconProps } from '@/types';

export const InfoIcon: FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 514 514" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M257 153V166M257 257V361M257 491C386 491 491 386 491 257C491 128 386 23 257 23C128 23 23 128 23 257C23 386 128 491 257 491Z"
      stroke={color}
      strokeWidth="45"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
