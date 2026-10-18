import type { FC } from 'react';
import type { IconProps } from '@/types';

export const SearchIcon: FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.25"
    strokeLinecap="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5 21 21" />
  </svg>
);
