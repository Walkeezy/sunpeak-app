import type { TemperatureData } from './temperatureData';
import type { WindData } from './windData';

// Everything one MeteoSwiss station measured, joined across the datasets by station id
export type Station = {
  id: string;
  name?: string;
  latitude: number;
  longitude: number;
  altitude?: number;
  measuredAt?: string;
  temperature?: number;
  gust?: number;
  direction?: number;
};

export const mergeStations = (temperatures: TemperatureData, winds: WindData): Map<string, Station> => {
  const stations = new Map<string, Station>();

  // Temperature stations come first, so their position wins where the datasets differ slightly
  for (const { id, stationName, latitude, longitude, altitude, measuredAt, value } of temperatures) {
    stations.set(id, { id, name: stationName, latitude, longitude, altitude, measuredAt, temperature: value });
  }

  for (const { id, stationName, latitude, longitude, altitude, measuredAt, value, direction } of winds) {
    const station = stations.get(id);

    stations.set(id, {
      id,
      name: station?.name ?? stationName,
      latitude: station?.latitude ?? latitude,
      longitude: station?.longitude ?? longitude,
      altitude: station?.altitude ?? altitude,
      measuredAt: station?.measuredAt ?? measuredAt,
      temperature: station?.temperature,
      gust: value,
      direction,
    });
  }

  return stations;
};
