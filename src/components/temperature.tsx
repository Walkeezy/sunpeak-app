import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj.js';
import { useMemo } from 'react';
import { RFeature, ROverlay } from 'rlayers';
import { Temperature as TemperatureType } from 'src/services/weatherData';

type Props = {
  temperature: TemperatureType;
};

export default function Temperature({ temperature }: Props): JSX.Element {
  const getPoint = useMemo(
    () => new Point(fromLonLat([temperature.longitude, temperature.latitude])),
    [temperature.longitude, temperature.latitude]
  );

  return (
    <RFeature geometry={getPoint}>
      <ROverlay className="w-8 h-8 rounded-full flex items-center justify-center border border-white bg-slate-700 text-white text-[10px] -translate-x-1/2 -translate-y-1/2 shadow-md pointer-events-none select-none">
        <span className="ml-[2px]">{temperature.value}°</span>
      </ROverlay>
    </RFeature>
  );
}
