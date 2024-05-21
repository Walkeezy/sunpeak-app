import { DivIcon } from 'leaflet';
import { FC } from 'react';
import { Marker } from 'react-leaflet';
import { Temperature as TemperatureType } from '../services/weatherData';

type Props = {
  temperature: TemperatureType;
};

export const Temperature: FC<Props> = ({ temperature }) => {
  const icon = new DivIcon({
    className: '',
    iconSize: [32, 32],
    html: `<div class="pointer-events-none flex w-full h-full font-sans select-none items-center justify-center rounded-full border border-white bg-slate-700 text-[10px] text-white shadow-md"><span class="ml-[2px]">${temperature.value}°</span></div>`,
  });

  return <Marker position={[temperature.latitude, temperature.longitude]} icon={icon} />;
};
