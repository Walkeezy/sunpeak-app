import { describe, expect, test } from 'vitest';
import { parseMapCenter } from './parseMapCenter';

describe('parseMapCenter', () => {
  test('returns the cookie values when they are valid', () => {
    expect(parseMapCenter('46.85', '9.53', '11')).toEqual({
      centerLat: '46.85',
      centerLon: '9.53',
      zoom: '11',
    });
  });

  test('returns undefined when any value is missing', () => {
    expect(parseMapCenter(undefined, '9.53', '11')).toBeUndefined();
    expect(parseMapCenter('46.85', undefined, '11')).toBeUndefined();
    expect(parseMapCenter('46.85', '9.53', undefined)).toBeUndefined();
  });

  test('returns undefined when a value is not finite', () => {
    expect(parseMapCenter('not-a-number', '9.53', '11')).toBeUndefined();
    expect(parseMapCenter('46.85', 'nope', '11')).toBeUndefined();
    expect(parseMapCenter('46.85', '9.53', 'zoom')).toBeUndefined();
  });

  test('returns undefined when zoom is outside the allowed range', () => {
    expect(parseMapCenter('46.85', '9.53', '8')).toBeUndefined();
    expect(parseMapCenter('46.85', '9.53', '14')).toBeUndefined();
  });
});
