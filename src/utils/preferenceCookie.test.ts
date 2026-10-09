import { afterEach, describe, expect, test, vi } from 'vitest';
import { saveCenterToCookie, saveLayerToCookie } from './preferenceCookie';

const cookieWrites = () => {
  const writes: string[] = [];
  vi.spyOn(document, 'cookie', 'set').mockImplementation((value: string) => {
    writes.push(value);
  });

  return writes;
};

describe('preferenceCookie', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test('saves a valid map center as three cookies', () => {
    const writes = cookieWrites();

    saveCenterToCookie('46.85', '9.53', '10');

    expect(writes).toEqual([
      'mapCenterLat=46.85; Path=/; Max-Age=31536000; SameSite=Lax',
      'mapCenterLon=9.53; Path=/; Max-Age=31536000; SameSite=Lax',
      'mapZoom=10; Path=/; Max-Age=31536000; SameSite=Lax',
    ]);
  });

  test('ignores an invalid map center', () => {
    const writes = cookieWrites();

    saveCenterToCookie('abc', '9.53', '10');
    saveCenterToCookie('46.85', '9.53', '99');

    expect(writes).toEqual([]);
  });

  test('saves known layers and ignores unknown ones', () => {
    const writes = cookieWrites();

    saveLayerToCookie('Wind', true);
    saveLayerToCookie('Unknown', true);

    expect(writes).toEqual(['layerWind=true; Path=/; Max-Age=31536000; SameSite=Lax']);
  });

  test('adds the Secure attribute on https', () => {
    vi.stubGlobal('location', { protocol: 'https:' });
    const writes = cookieWrites();

    saveLayerToCookie('Temperature', false);

    expect(writes).toEqual(['layerTemperature=false; Path=/; Max-Age=31536000; SameSite=Lax; Secure']);
  });
});
