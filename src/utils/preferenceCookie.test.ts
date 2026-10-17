import { afterEach, describe, expect, test, vi } from 'vitest';
import type { Locale } from '@/i18n/config';
import {
  layerVisibilityFromCookies,
  parseMinAltitude,
  saveCenterToCookie,
  saveLayerToCookie,
  saveLocaleToCookie,
  saveMinAltitudeToCookie,
} from './preferenceCookie';

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

  test('saves a supported locale and ignores others', () => {
    const writes = cookieWrites();

    saveLocaleToCookie('en');
    saveLocaleToCookie('fr' as Locale);

    expect(writes).toEqual(['locale=en; Path=/; Max-Age=31536000; SameSite=Lax']);
  });

  test('reads saved layer choices and falls back to the defaults', () => {
    const cookies: Record<string, string> = { layerWind: 'true', layerSunshine: 'false' };

    expect(layerVisibilityFromCookies((name) => cookies[name])).toEqual({
      Webcams: true,
      Temperature: true,
      Sunshine: false,
      Wind: true,
    });
  });

  test('saves and reads the altitude filter steps only', () => {
    const writes = cookieWrites();

    saveMinAltitudeToCookie(1500);
    saveMinAltitudeToCookie(1234);

    expect(writes).toEqual(['minAltitude=1500; Path=/; Max-Age=31536000; SameSite=Lax']);
    expect(parseMinAltitude('1500')).toBe(1500);
    expect(parseMinAltitude('1234')).toBe(0);
    expect(parseMinAltitude(undefined)).toBe(0);
  });

  test('adds the Secure attribute on https', () => {
    vi.stubGlobal('location', { protocol: 'https:' });
    const writes = cookieWrites();

    saveLayerToCookie('Temperature', false);

    expect(writes).toEqual(['layerTemperature=false; Path=/; Max-Age=31536000; SameSite=Lax; Secure']);
  });
});
