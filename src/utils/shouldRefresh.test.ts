import { describe, expect, test } from 'vitest';
import { latestMeasurement, shouldRefresh } from './shouldRefresh';

describe('shouldRefresh', () => {
  test('refreshes once the data is old enough', () => {
    expect(shouldRefresh(0, 299_999, 300_000)).toBe(false);
    expect(shouldRefresh(0, 300_000, 300_000)).toBe(true);
  });
});

describe('latestMeasurement', () => {
  test('returns the newest ISO timestamp', () => {
    expect(
      latestMeasurement([
        { measuredAt: '2026-10-17T10:40:00Z' },
        {},
        { measuredAt: '2026-10-17T10:50:00Z' },
        { measuredAt: '2026-10-17T10:30:00Z' },
      ]),
    ).toBe('2026-10-17T10:50:00Z');
  });

  test('is undefined without timestamps', () => {
    expect(latestMeasurement([{}, {}])).toBeUndefined();
  });
});
