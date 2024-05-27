import { DivIcon } from 'leaflet';
import { FC } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker } from 'react-leaflet';
import { Wind as WindType } from '../services/windData';

type Props = {
  wind: WindType;
};

const WindIcon: FC<{ value: number }> = ({ value }) => {
  return (
    <div className="pointer-events-none flex h-full w-full select-none items-center justify-center rounded-full border border-white bg-slate-700 font-sans text-[10px] text-white shadow-md">
      <span className="flex flex-col text-center leading-none">
        <span>{value}</span>
        <span className="text-[7px]">km/h</span>
      </span>
    </div>
  );
};

export const Wind: FC<Props> = ({ wind }) => {
  const icon = new DivIcon({
    className: '',
    iconSize: [32, 32],
    html: renderToString(<WindIcon value={wind.value} />),
  });

  return <Marker position={[wind.latitude, wind.longitude]} icon={icon} riseOnHover />;
};
