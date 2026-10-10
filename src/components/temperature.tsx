import { DivIcon } from 'leaflet';
import { type FC, useMemo } from 'react';
import { Marker } from 'react-leaflet';
import type { Temperature as TemperatureType } from '@/services/temperatureData';
import { temperatureLabel } from '@/utils/temperatureLabel';

type Props = {
  temperature: TemperatureType;
};

// Plain markup rather than renderToString, which would ship React's server renderer to the browser
const temperatureIconHtml = (value: number) =>
  `<div class="bg-schiefer border-firn text-firn signage pointer-events-none flex h-full w-full items-center justify-center rounded-full border font-sans text-[11px] shadow-md select-none"><span class="ml-[2px]">${value}°</span></div>`;

export const Temperature: FC<Props> = ({ temperature }) => {
  const icon = useMemo(
    () =>
      new DivIcon({
        className: '',
        iconSize: [32, 32],
        html: temperatureIconHtml(temperature.value),
      }),
    [temperature.value],
  );
  const label = temperatureLabel(temperature);

  return (
    <Marker
      position={[temperature.latitude, temperature.longitude]}
      icon={icon}
      title={label}
      alt={label}
      keyboard={false}
      riseOnHover
    />
  );
};
