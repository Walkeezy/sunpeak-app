import type { FC } from 'react';
import type { IconProps } from '@/types';

export const CloseIcon: FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg
    aria-hidden="true"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);
