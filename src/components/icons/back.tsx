import type { FC } from 'react';
import type { IconProps } from '@/types';

export const BackIcon: FC<IconProps> = ({ size = 20, color = 'currentColor' }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 514 514" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 257C0 115 115 0 257 0C399 0 514 115 514 257C514 399 399 514 257 514C115 514 0 399 0 257ZM257 45C140 45 45 140 45 257C45 374 140 469 257 469C374 469 469 374 469 257C469 140 374 45 257 45Z"
      fill={color}
    />
    <path
      d="M181 276L260 363C267 371 266 382 258 389C251 395 239 394 233 387L127 271C126 269 124 267 124 265C122 263 122 260 122 258L122 258C122 255 123 252 124 250C124 250 124 249 124 249C125 248 126 247 127 246L236 128C242 120 254 120 261 127C268 134 269 145 262 152L181 240H374C384 240 392 248 392 258C392 268 384 276 374 276L181 276Z"
      fill={color}
    />
  </svg>
);
