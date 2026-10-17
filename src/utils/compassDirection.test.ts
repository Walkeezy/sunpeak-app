import { describe, expect, test } from 'vitest';
import { compassDirection } from './compassDirection';

describe('compassDirection', () => {
  test('maps the cardinal and intercardinal bearings', () => {
    expect([0, 45, 90, 135, 180, 225, 270, 315].map(compassDirection)).toEqual(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']);
  });

  test('rounds to the nearest point and wraps around north', () => {
    expect(compassDirection(22)).toBe('N');
    expect(compassDirection(23)).toBe('NE');
    expect(compassDirection(350)).toBe('N');
    expect(compassDirection(360)).toBe('N');
    expect(compassDirection(-90)).toBe('W');
  });
});
