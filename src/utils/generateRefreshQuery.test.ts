import { describe, expect, test, vi } from 'vitest';
import { generateRefreshQuery } from './generateRefreshQuery';

vi.useFakeTimers();

describe('generateRefreshQuery', () => {
  test('get refresh query for 15:36', () => {
    vi.setSystemTime(new Date('2020-01-01 15:36'));
    expect(generateRefreshQuery()).toBe('1-15-30');
  });

  test('get refresh query for 15:36', () => {
    vi.setSystemTime(new Date('2020-01-02 08:47'));
    expect(generateRefreshQuery()).toBe('2-8-45');
  });
});
