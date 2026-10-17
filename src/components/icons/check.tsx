import type { FC } from 'react';
import type { IconProps } from '@/types';

export const CheckIcon: FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
);
