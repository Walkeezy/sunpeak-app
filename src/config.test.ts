import { describe, expect, test } from 'vitest';
import { camIconSize } from './config';

describe('camIconSize', () => {
  test('returns the size for each zoom band', () => {
    expect(camIconSize(9)).toBe(36);
    expect(camIconSize(10)).toBe(36);
    expect(camIconSize(11)).toBe(42);
    expect(camIconSize(12)).toBe(56);
    expect(camIconSize(13)).toBe(64);
    expect(camIconSize(14)).toBe(72);
  });
});
