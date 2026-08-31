import { afterEach, describe, expect, test, vi } from 'vitest';
import { FETCH_TIMEOUT_MS } from '@/config';
import { fetchMeasurementData } from './measurementData';

// LV95 coordinates of the projection origin (Bern), which maps to ~7.44° E / ~46.95° N
const bernLV95 = [2_600_000, 1_200_000];

const mockFetchResponse = (body: unknown) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(body) }));
};

describe('fetchMeasurementData', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('maps features and converts LV95 coordinates to WGS84', async () => {
    mockFetchResponse({
      features: [{ id: 'BER', geometry: { coordinates: bernLV95 }, properties: { value: 21.5 } }],
    });

    const data = await fetchMeasurementData('https://example.com/data.json');

    expect(data).toHaveLength(1);
    expect(data[0].id).toBe('BER');
    expect(data[0].value).toBe(21.5);
    expect(data[0].longitude).toBeCloseTo(7.44, 2);
    expect(data[0].latitude).toBeCloseTo(46.95, 2);

    const init = vi.mocked(fetch).mock.calls[0]?.[1] as { next?: { revalidate: number; tags: string[] } } | undefined;
    expect(init?.next).toEqual({ revalidate: 600, tags: ['measurements'] });
  });

  test('returns empty array when response has no features', async () => {
    mockFetchResponse({});

    await expect(fetchMeasurementData('https://example.com/data.json')).resolves.toEqual([]);
  });

  test('throws when response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) }));

    await expect(fetchMeasurementData('https://example.com/data.json')).rejects.toThrow(
      'Failed to fetch measurement data: 500',
    );
  });

  test('throws when fetch fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));

    await expect(fetchMeasurementData('https://example.com/data.json')).rejects.toThrow('network error');
  });

  test('uses a timeout signal', async () => {
    const timeoutSpy = vi.spyOn(AbortSignal, 'timeout');
    mockFetchResponse({ features: [] });

    await fetchMeasurementData('https://example.com/data.json');

    expect(timeoutSpy).toHaveBeenCalledWith(FETCH_TIMEOUT_MS);
  });
});
