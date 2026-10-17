import { describe, expect, test } from 'vitest';
import { webcamSubtitle } from './webcamSubtitle';

describe('webcamSubtitle', () => {
  test('joins place and altitude', () => {
    expect(webcamSubtitle({ city: 'Schwägalp', altitude: 1352 }, '{altitude} m ü. M.', 'de')).toBe(
      'Schwägalp · 1’352 m ü. M.',
    );
  });

  test('leaves out what is unknown', () => {
    expect(webcamSubtitle({ city: '', altitude: 2502 }, '{altitude} m', 'en')).toBe('2,502 m');
    expect(webcamSubtitle({ city: 'Davos' }, '{altitude} m', 'en')).toBe('Davos');
    expect(webcamSubtitle({ city: '' }, '{altitude} m', 'en')).toBe('');
  });
});
