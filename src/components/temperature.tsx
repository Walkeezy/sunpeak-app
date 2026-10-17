import { DivIcon } from 'leaflet';
import { type FC, useMemo } from 'react';
import { Marker } from 'react-leaflet';
import type { Temperature as TemperatureType } from '@/services/temperatureData';
import { temperatureLabel } from '@/utils/temperatureLabel';

type Props = {
  temperature: TemperatureType;
  onSelect: (stationId: string) => void;
};

// Plain markup rather than renderToString, which would ship React's server renderer to the browser
const temperatureIconHtml = (value: number) =>
  `<div class="bg-schiefer border-firn text-firn signage flex h-full w-full cursor-pointer items-center justify-center rounded-full border font-sans text-[11px] shadow-md select-none"><span class="ml-[2px]">${value}°</span></div>`;

export const Temperature: FC<Props> = ({ temperature, onSelect }) => {
  const icon = useMemo(
    () =>
      new DivIcon({
        className: '',
        iconSize: [32, 32],
        html: temperatureIconHtml(temperature.value),
      }),
    [temperature.value],
  );
  const eventHandlers = useMemo(() => ({ click: () => onSelect(temperature.id) }), [onSelect, temperature.id]);
  const label = temperatureLabel(temperature);

  return (
    <Marker
      position={[temperature.latitude, temperature.longitude]}
      icon={icon}
      title={label}
      alt={label}
      // The station popup is a touch convenience; the values are in the title for keyboard and screen reader users
      keyboard={false}
      eventHandlers={eventHandlers}
      riseOnHover
    />
  );
};
