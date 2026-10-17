import { describe, expect, test } from 'vitest';
import { distanceInKm, nearestMeasurement } from './nearestMeasurement';

const bern = { latitude: 46.948, longitude: 7.447 };
const zurich = { latitude: 47.3769, longitude: 8.5417 };
const saentis = { latitude: 47.2494, longitude: 9.3434 };

describe('distanceInKm', () => {
  test('is zero for the same point', () => {
    expect(distanceInKm(bern.latitude, bern.longitude, bern.latitude, bern.longitude)).toBe(0);
  });

  test('measures Bern to Zurich at roughly 95 km', () => {
    expect(distanceInKm(bern.latitude, bern.longitude, zurich.latitude, zurich.longitude)).toBeGreaterThan(94);
    expect(distanceInKm(bern.latitude, bern.longitude, zurich.latitude, zurich.longitude)).toBeLessThan(97);
  });
});

describe('nearestMeasurement', () => {
  test('returns undefined for no measurements', () => {
    expect(nearestMeasurement([], 47, 8)).toBeUndefined();
  });

  test('picks the closest station with its distance', () => {
    const stations = [
      { id: 'BER', ...bern, value: 12 },
      { id: 'SAE', ...saentis, value: -2 },
      { id: 'ZUR', ...zurich, value: 10 },
    ];

    // Schwägalp sits right below the Säntis
    const nearest = nearestMeasurement(stations, 47.26, 9.32);

    expect(nearest?.measurement.id).toBe('SAE');
    expect(nearest?.distanceKm).toBeLessThan(3);
  });
});
