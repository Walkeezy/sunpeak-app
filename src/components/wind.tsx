import { DivIcon } from 'leaflet';
import type { FC } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker } from 'react-leaflet';
import type { Wind as WindType } from '@/services/windData';

type Props = {
  wind: WindType;
};

const ICON_SIZE = 120;
const CX = 60;
const CY = 60;
const BODY_Y = 30;

const WindIcon: FC<{ value: number; direction?: number }> = ({ value, direction }) => {
  const bearing = direction == null ? 180 : direction + 180;
  const speed = Math.round(value);

  return (
    <div className="pointer-events-none relative h-full w-full select-none">
      <svg className="absolute inset-0 overflow-visible" viewBox="0 0 120 120" aria-hidden="true">
        <g transform={`rotate(${bearing} ${CX} ${CY})`}>
          {direction == null ? (
            <circle cx={CX} cy={BODY_Y} r="14" fill="#64748b" stroke="#ffffff" strokeWidth="1.5" />
          ) : (
            <path
              d="M60 7 L70 20 A14 14 0 1 1 50 20 Z"
              fill="#64748b"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          )}
          <text
            x={CX}
            y={BODY_Y}
            fill="#ffffff"
            fontFamily="var(--lexend-font), sans-serif"
            textAnchor="middle"
            transform={`rotate(${-bearing} ${CX} ${BODY_Y})`}
          >
            <tspan x={CX} dy="-2" fontSize="10">
              {speed}
            </tspan>
            <tspan x={CX} dy="9" fontSize="7">
              km/h
            </tspan>
          </text>
        </g>
      </svg>
    </div>
  );
};

export const Wind: FC<Props> = ({ wind }) => {
  const icon = new DivIcon({
    className: 'wind-icon',
    iconSize: [ICON_SIZE, ICON_SIZE],
    iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
    html: renderToString(<WindIcon value={wind.value} direction={wind.direction} />),
  });

  return <Marker interactive={false} zIndexOffset={500} position={[wind.latitude, wind.longitude]} icon={icon} />;
};
