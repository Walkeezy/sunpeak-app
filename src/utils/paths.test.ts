import { describe, expect, test } from 'vitest';
import {
  infoPath,
  localizedPath,
  mapPath,
  mapWithWebcamPath,
  placePagePath,
  switchLocalePath,
  webcamPagePath,
  webcamsPath,
} from './paths';

describe('paths', () => {
  test('prefixes every path with the locale', () => {
    expect(localizedPath('de', '/')).toBe('/de');
    expect(localizedPath('en', '/info')).toBe('/en/info');
    expect(mapPath('de')).toBe('/de');
    expect(infoPath('en')).toBe('/en/info');
    expect(webcamsPath('de')).toBe('/de/webcams');
  });

  test('builds the webcam page path', () => {
    expect(webcamPagePath('de', 'saentis-schwaegalp')).toBe('/de/webcams/saentis-schwaegalp');
  });

  test('builds the place page path', () => {
    expect(placePagePath('en', 'lenzerheide')).toBe('/en/webcams/in/lenzerheide');
  });

  test('builds the map path with the cam search param', () => {
    expect(mapWithWebcamPath('en', 'saentis-schwaegalp')).toBe('/en?cam=saentis-schwaegalp');
  });

  test('encodes unexpected characters', () => {
    expect(webcamPagePath('de', 'a b')).toBe('/de/webcams/a%20b');
  });

  test('switches the locale prefix of a path', () => {
    expect(switchLocalePath('/de', 'en')).toBe('/en');
    expect(switchLocalePath('/de/webcams/saentis', 'en')).toBe('/en/webcams/saentis');
    expect(switchLocalePath('/en/info', 'de')).toBe('/de/info');
  });

  test('adds a prefix to unprefixed paths', () => {
    expect(switchLocalePath('/', 'de')).toBe('/de');
    expect(switchLocalePath('/webcams', 'en')).toBe('/en/webcams');
  });
});
