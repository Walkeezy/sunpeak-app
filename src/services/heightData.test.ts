import { afterEach, describe, expect, test, vi } from 'vitest';
import { getHeight } from './heightData';
import { wgs84ToLv95 } from './measurementData';

const mockFetch = (response: { ok: boolean; status?: number; body?: unknown }) => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: response.ok, status: response.status ?? 200, json: async () => response.body }),
  );
};

describe('wgs84ToLv95', () => {
  test('converts the LV95 origin near Bern', () => {
    const [easting, northing] = wgs84ToLv95(46.9510811, 7.4386372);

    expect(easting).toBeCloseTo(2_600_000, -1);
    expect(northing).toBeCloseTo(1_200_000, -1);
  });
});

describe('getHeight', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('asks swisstopo with rounded LV95 coordinates and caches the answer', async () => {
    mockFetch({ ok: true, body: { height: '2501.8' } });

    await expect(getHeight(47.2494, 9.3434)).resolves.toBe(2502);

    const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit & { next?: unknown }];
    expect(url).toMatch(/^https:\/\/api3\.geo\.admin\.ch\/rest\/services\/height\?easting=\d+&northing=\d+&sr=2056$/);
    expect(init.cache).toBe('force-cache');
    expect(init.next).toEqual({ revalidate: false, tags: ['heights'] });
  });

  test('throws for an error response', async () => {
    mockFetch({ ok: false, status: 400, body: { error: 'outside' } });

    await expect(getHeight(48.5, 11)).rejects.toThrow('400');
  });

  test('throws when the height is missing', async () => {
    mockFetch({ ok: true, body: {} });

    await expect(getHeight(47, 8)).rejects.toThrow('No height');
  });
});
