import { fetchMeasurementData, type Measurement } from './measurementData';

// Minutes of sunshine in the last ten minutes. Name, time and altitude come from the temperature station,
// so they stay off the wire here
type Sunshine = Pick<Measurement, 'id' | 'latitude' | 'longitude' | 'value'>;
export type SunshineData = Sunshine[];

const SUNSHINE_URL =
  'https://data.geo.admin.ch/ch.meteoschweiz.messwerte-sonnenscheindauer-10min/ch.meteoschweiz.messwerte-sonnenscheindauer-10min_de.json';

export async function getSunshineData(): Promise<SunshineData> {
  const data = await fetchMeasurementData(SUNSHINE_URL);

  // MeteoSwiss marks a missing measurement with 99999
  return data
    .filter(({ value }) => value >= 0 && value <= 10)
    .map(({ id, latitude, longitude, value }) => ({ id, latitude, longitude, value }));
}
