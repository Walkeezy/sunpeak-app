import { describe, expect, test } from 'vitest';
import { formatMeasurementTime, temperatureLabel } from './temperatureLabel';

const base = { id: 'ARO', latitude: 46.8, longitude: 9.7, value: 8.1 };

describe('temperatureLabel', () => {
  test('includes station name and local measurement time', () => {
    expect(temperatureLabel({ ...base, stationName: 'Arosa', measuredAt: '2026-10-09T14:10:00Z' })).toBe(
      'Arosa: 8.1 °C (16:10)',
    );
  });

  test('falls back to the value only', () => {
    expect(temperatureLabel(base)).toBe('8.1 °C');
  });

  test('ignores an invalid timestamp', () => {
    expect(temperatureLabel({ ...base, stationName: 'Arosa', measuredAt: 'invalid' })).toBe('Arosa: 8.1 °C');
  });
});

describe('formatMeasurementTime', () => {
  test('formats the measurement in Swiss local time', () => {
    expect(formatMeasurementTime('2026-10-09T14:10:00Z')).toBe('16:10');
  });

  test('is undefined for a missing or invalid timestamp', () => {
    expect(formatMeasurementTime(undefined)).toBeUndefined();
    expect(formatMeasurementTime('not a date')).toBeUndefined();
  });
});
