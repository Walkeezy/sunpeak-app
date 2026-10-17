import type { Measurement } from '@/services/measurementData';

const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

// Great-circle distance; precise enough to pick the closest station and show a rounded distance
export const distanceInKm = (fromLat: number, fromLon: number, toLat: number, toLon: number): number => {
  const dLat = toRadians(toLat - fromLat);
  const dLon = toRadians(toLon - fromLon);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(fromLat)) * Math.cos(toRadians(toLat)) * Math.sin(dLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};

export type NearestMeasurement<T extends Measurement> = { measurement: T; distanceKm: number };

export const nearestMeasurement = <T extends Measurement>(
  measurements: T[],
  latitude: number,
  longitude: number,
): NearestMeasurement<T> | undefined => {
  let nearest: NearestMeasurement<T> | undefined;

  for (const measurement of measurements) {
    const distanceKm = distanceInKm(latitude, longitude, measurement.latitude, measurement.longitude);

    if (!nearest || distanceKm < nearest.distanceKm) {
      nearest = { measurement, distanceKm };
    }
  }

  return nearest;
};
