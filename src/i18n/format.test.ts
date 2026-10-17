import { createElement, isValidElement } from 'react';
import { describe, expect, test } from 'vitest';
import { fill, placeholders, rich } from './format';

describe('fill', () => {
  test('replaces placeholders', () => {
    expect(fill('Open {name} in {city}', { name: 'Säntis', city: 'Schwägalp' })).toBe('Open Säntis in Schwägalp');
  });

  test('keeps unknown placeholders', () => {
    expect(fill('{a} and {b}', { a: 1 })).toBe('1 and {b}');
  });
});

describe('rich', () => {
  test('puts nodes in place of placeholders and keeps the text around them', () => {
    const link = createElement('a', { href: '/de' }, 'Karte');
    const parts = rich('Zurück zur {map}.', { map: link });

    expect(parts).toHaveLength(3);
    expect(parts[0]).toBe('Zurück zur ');
    expect(isValidElement(parts[1])).toBe(true);
    expect(parts[2]).toBe('.');
  });

  test('leaves text without placeholders alone', () => {
    expect(rich('Nothing to do', {})).toEqual(['Nothing to do']);
  });
});

describe('placeholders', () => {
  test('lists placeholder names sorted', () => {
    expect(placeholders('{b} then {a}')).toEqual(['a', 'b']);
  });
});
