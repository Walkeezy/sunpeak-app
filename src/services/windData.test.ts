import { afterEach, describe, expect, test, vi } from 'vitest';
import { getWindData } from './windData';

vi.mock('next/cache', () => ({ unstable_noStore: vi.fn() }));

describe('getWindData', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('returns all measurements without filtering', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({
            features: [
              { id: 'calm', geometry: { coordinates: [2_600_000, 1_200_000] }, properties: { value: 5 } },
              { id: 'storm', geometry: { coordinates: [2_600_000, 1_200_000] }, properties: { value: 130 } },
            ],
          }),
      }),
    );

    const data = await getWindData();

    expect(data.map(({ id, value }) => ({ id, value }))).toEqual([
      { id: 'calm', value: 5 },
      { id: 'storm', value: 130 },
    ]);
  });
});
