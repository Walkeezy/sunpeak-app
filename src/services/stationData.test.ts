import { describe, expect, test } from 'vitest';
import { mergeStations } from './stationData';

const base = { latitude: 46.8, longitude: 9.7 };

describe('mergeStations', () => {
  test('joins temperature and wind of the same station', () => {
    const stations = mergeStations(
      [{ id: 'ARO', ...base, value: 8.1, stationName: 'Arosa', altitude: 1878, measuredAt: '2026-10-17T10:50:00Z' }],
      [{ id: 'ARO', latitude: 46.81, longitude: 9.71, value: 14.4, direction: 105, altitude: 1888 }],
    );

    expect(stations.get('ARO')).toEqual({
      id: 'ARO',
      name: 'Arosa',
      ...base,
      altitude: 1878,
      measuredAt: '2026-10-17T10:50:00Z',
      temperature: 8.1,
      gust: 14.4,
      direction: 105,
    });
  });

  test('keeps stations that only measure one value', () => {
    const stations = mergeStations(
      [{ id: 'TEMP', ...base, value: 3 }],
      [{ id: 'WIND', ...base, value: 40, stationName: 'Gütsch', altitude: 2287 }],
    );

    expect(stations.get('TEMP')).toEqual({ id: 'TEMP', ...base, temperature: 3 });
    expect(stations.get('WIND')).toEqual({ id: 'WIND', name: 'Gütsch', ...base, altitude: 2287, gust: 40 });
  });
});
