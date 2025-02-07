import { DivIcon } from 'leaflet';
import { FC } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker } from 'react-leaflet';
import { Temperature as TemperatureType } from '../services/temperatureData';

type Props = {
  temperature: TemperatureType;
};

const TemperatureIcon: FC<{ value: number }> = ({ value }) => {
  return (
    <div className="pointer-events-none flex h-full w-full items-center justify-center rounded-full border border-white bg-slate-700 font-sans text-[10px] text-white shadow-md select-none">
      <span className="ml-[2px]">{value}°</span>
    </div>
  );
};

export const Temperature: FC<Props> = ({ temperature }) => {
  const icon = new DivIcon({
    className: '',
    iconSize: [32, 32],
    html: renderToString(<TemperatureIcon value={temperature.value} />),
  });

  return <Marker position={[temperature.latitude, temperature.longitude]} icon={icon} riseOnHover />;
};
