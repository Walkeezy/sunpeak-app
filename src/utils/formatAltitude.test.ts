import { describe, expect, test } from 'vitest';
import { formatAltitude } from './formatAltitude';

describe('formatAltitude', () => {
  test('uses the Swiss thousands separator in German', () => {
    expect(formatAltitude(2502, 'de')).toBe('2’502');
  });

  test('uses a comma in English and rounds', () => {
    expect(formatAltitude(1879.6, 'en')).toBe('1,880');
    expect(formatAltitude(408, 'en')).toBe('408');
  });
});
