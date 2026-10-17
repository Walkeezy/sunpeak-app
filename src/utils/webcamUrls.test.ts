import { describe, expect, test } from 'vitest';
import { mapWithWebcamPath, webcamPagePath } from './webcamUrls';

describe('webcam urls', () => {
  test('builds the page path', () => {
    expect(webcamPagePath('saentis-schwaegalp')).toBe('/webcams/saentis-schwaegalp');
  });

  test('builds the map path with the cam search param', () => {
    expect(mapWithWebcamPath('saentis-schwaegalp')).toBe('/?cam=saentis-schwaegalp');
  });

  test('encodes unexpected characters', () => {
    expect(webcamPagePath('a b')).toBe('/webcams/a%20b');
  });
});
