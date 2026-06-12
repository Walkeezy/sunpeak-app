import { fetchMeasurementData, Measurement } from './measurementData';

export type Wind = Measurement;
export type WindData = Wind[];

const WIND_URL =
  'https://data.geo.admin.ch/ch.meteoschweiz.messwerte-wind-boeenspitze-kmh-10min/ch.meteoschweiz.messwerte-wind-boeenspitze-kmh-10min_de.json';

export async function getWindData(): Promise<WindData> {
  return fetchMeasurementData(WIND_URL);
}
