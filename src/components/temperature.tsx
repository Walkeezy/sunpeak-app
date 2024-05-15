import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj.js';
import { useMemo } from 'react';
import { RFeature, ROverlay } from 'rlayers';
import { Temperature as TemperatureType } from '../services/weatherData';

type Props = {
  temperature: TemperatureType;
};

export default function Temperature({ temperature }: Props): JSX.Element {
  const getPoint = useMemo(
    () => new Point(fromLonLat([temperature.longitude, temperature.latitude])),
    [temperature.longitude, temperature.latitude],
  );

  return (
    <RFeature geometry={getPoint}>
      <ROverlay className="pointer-events-none flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 select-none items-center justify-center rounded-full border border-white bg-slate-700 text-[10px] text-white shadow-md">
        <span className="ml-[2px]">{temperature.value}°</span>
      </ROverlay>
    </RFeature>
  );
}
