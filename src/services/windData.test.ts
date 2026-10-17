import { afterEach, describe, expect, test, vi } from 'vitest';
import { getWindData } from './windData';

const feature = (id: string, value: number, windDirection?: number | null) => ({
  id,
  geometry: { coordinates: [2_600_000, 1_200_000] },
  properties: { value, station_name: id, altitude: '1888.00', wind_direction: windDirection },
});

describe('getWindData', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('returns every gust with its direction, without filtering', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ features: [feature('calm', 5, 180), feature('storm', 130, null)] }),
      }),
    );

    const data = await getWindData();

    expect(data.map(({ id, value, direction, altitude }) => ({ id, value, direction, altitude }))).toEqual([
      { id: 'calm', value: 5, direction: 180, altitude: 1888 },
      { id: 'storm', value: 130, direction: undefined, altitude: 1888 },
    ]);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
