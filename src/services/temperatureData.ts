import { fetchMeasurementData, Measurement } from './measurementData';

export type Temperature = Measurement;
export type TemperatureData = Temperature[];

const TEMPERATURE_URL =
  'https://data.geo.admin.ch/ch.meteoschweiz.messwerte-lufttemperatur-10min/ch.meteoschweiz.messwerte-lufttemperatur-10min_de.json';

export async function getTemperatureData(): Promise<TemperatureData> {
  const data = await fetchMeasurementData(TEMPERATURE_URL);

  // Filter out temperatures that don't make sense
  return data.filter((temperature) => temperature.value > -50 && temperature.value < 50);
}
