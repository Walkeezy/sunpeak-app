import { test, describe, expect } from 'vitest';
import { convertToLargeRoundshotUrl } from './convertToLargeRoundshotUrl';

describe('convertToLargeRoundshotUrl', () => {
  const data = [
    { input: 'https://backend.roundshot.com/cams/151/50', expected: 'https://backend.roundshot.com/cams/151/1000' },
    { input: 'https://backend.roundshot.com/cams/500/400', expected: 'https://backend.roundshot.com/cams/500/1000' },
    { input: 'https://xyz.com/cams/123/456', expected: 'https://xyz.com/cams/123/456' },
  ];

  test.each(data)('convert urls correctly', ({ input, expected }) => {
    expect(convertToLargeRoundshotUrl(input)).toBe(expected);
  });
});
