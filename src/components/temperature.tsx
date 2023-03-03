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
      <ROverlay className="relative">
        <div className="relative z-5 bg-white text-slate-700 border border-slate-700 text-xs rounded px-2 py-1 -translate-x-1/2 shadow-md">
          {temperature.value}
          {temperature.unit}
        </div>
        <span
          className="absolute rotate-45 bg-white z-0"
          style={{
            top: `-2px`,
            left: `-2px`,
            width: `6px`,
            height: `6px`,
          }}
        ></span>
      </ROverlay>
    </RFeature>
  );
}
