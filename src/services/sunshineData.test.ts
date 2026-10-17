import { afterEach, describe, expect, test, vi } from 'vitest';
import { getSunshineData } from './sunshineData';

const feature = (id: string, value: number) => ({
  id,
  geometry: { coordinates: [2_600_000, 1_200_000] },
  properties: { value, station_name: id, altitude: '1880.00', reference_ts: '2026-10-17T07:30:00Z' },
});

describe('getSunshineData', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('keeps the ten-minute values and drops missing ones', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ features: [feature('ARO', 10), feature('BER', 0), feature('GVE', 99999)] }),
      }),
    );

    const data = await getSunshineData();

    expect(data.map(({ id, value }) => ({ id, value }))).toEqual([
      { id: 'ARO', value: 10 },
      { id: 'BER', value: 0 },
    ]);
    expect(Object.keys(data[0]).toSorted()).toEqual(['id', 'latitude', 'longitude', 'value']);
  });
});
