import { describe, expect, test } from 'vitest';
import { firstByLetter, initialLetter } from './initialLetter';

describe('initialLetter', () => {
  test('returns the plain capital', () => {
    expect(initialLetter('Anzère')).toBe('A');
    expect(initialLetter('Üetliberg')).toBe('U');
    expect(initialLetter(' st. moritz')).toBe('S');
  });

  test('is empty when the name does not start with a letter', () => {
    expect(initialLetter('')).toBe('');
    expect(initialLetter('3 Seen')).toBe('');
  });
});

describe('firstByLetter', () => {
  test('keeps the first name of every letter', () => {
    const first = firstByLetter(['Andeer', 'Arosa', 'Bern', 'Üetliberg'], (name) => name);

    expect([...first]).toEqual([
      ['A', 'Andeer'],
      ['B', 'Bern'],
      ['U', 'Üetliberg'],
    ]);
  });
});
