import { describe, expect, test, vi } from 'vitest';
import { generateRefreshQuery, withRefreshQuery } from './generateRefreshQuery';

vi.useFakeTimers();

describe('generateRefreshQuery', () => {
  test('get refresh query for 15:36', () => {
    vi.setSystemTime(new Date('2020-01-01 15:36'));
    expect(generateRefreshQuery()).toBe('1-15-30');
  });

  test('get refresh query for 08:47', () => {
    vi.setSystemTime(new Date('2020-01-02 08:47'));
    expect(generateRefreshQuery()).toBe('2-8-45');
  });
});

describe('withRefreshQuery', () => {
  test('starts a query string when the url has none', () => {
    expect(withRefreshQuery('https://example.com/cam.jpg', '1-15-30')).toBe('https://example.com/cam.jpg?1-15-30');
  });

  test('appends to an existing query string', () => {
    expect(withRefreshQuery('https://example.com/cam.jpeg?lg=de&design=nox', '1-15-30')).toBe(
      'https://example.com/cam.jpeg?lg=de&design=nox&1-15-30',
    );
  });
});
