import { DivIcon } from 'leaflet';
import { type FC, useMemo } from 'react';
import { Marker } from 'react-leaflet';
import type { Wind as WindType } from '@/services/windData';

type Props = {
  wind: WindType;
};

const ICON_SIZE = 120;
const CX = 60;
const CY = 60;
const BODY_Y = 30;

// Plain markup rather than renderToString, which would ship React's server renderer to the browser
const windIconHtml = (value: number, direction?: number) => {
  const bearing = direction == null ? 180 : direction + 180;
  const speed = Math.round(value);
  const body =
    direction == null
      ? `<circle cx="${CX}" cy="${BODY_Y}" r="14" class="fill-nebel stroke-firn" stroke-width="1.5"></circle>`
      : `<path d="M60 7 L70 20 A14 14 0 1 1 50 20 Z" class="fill-nebel stroke-firn" stroke-width="1.5" stroke-linejoin="round"></path>`;

  return `<div class="pointer-events-none relative h-full w-full select-none"><svg class="absolute inset-0 overflow-visible" viewBox="0 0 120 120" aria-hidden="true"><g transform="rotate(${bearing} ${CX} ${CY})">${body}<text x="${CX}" y="${BODY_Y}" class="fill-firn signage font-sans" text-anchor="middle" transform="rotate(${-bearing} ${CX} ${BODY_Y})"><tspan x="${CX}" dy="-2" font-size="10">${speed}</tspan><tspan x="${CX}" dy="9" font-size="7">km/h</tspan></text></g></svg></div>`;
};

export const Wind: FC<Props> = ({ wind }) => {
  const icon = useMemo(
    () =>
      new DivIcon({
        className: 'wind-icon',
        iconSize: [ICON_SIZE, ICON_SIZE],
        iconAnchor: [ICON_SIZE / 2, ICON_SIZE / 2],
        html: windIconHtml(wind.value, wind.direction),
      }),
    [wind.value, wind.direction],
  );

  return <Marker interactive={false} zIndexOffset={500} position={[wind.latitude, wind.longitude]} icon={icon} />;
};
