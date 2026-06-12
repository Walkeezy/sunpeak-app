import { afterEach, describe, expect, test, vi } from 'vitest';
import { getTemperatureData } from './temperatureData';

vi.mock('next/cache', () => ({ unstable_noStore: vi.fn() }));

const feature = (id: string, value: number) => ({
  id,
  geometry: { coordinates: [2_600_000, 1_200_000] },
  properties: { value },
});

describe('getTemperatureData', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('filters out implausible temperatures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            features: [feature('ok', 21.5), feature('too-cold', -99), feature('too-hot', 99)],
          }),
      }),
    );

    const data = await getTemperatureData();

    expect(data.map(({ id }) => id)).toEqual(['ok']);
  });
});
