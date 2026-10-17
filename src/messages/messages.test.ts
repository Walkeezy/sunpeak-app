import { describe, expect, test } from 'vitest';
import { placeholders } from '@/i18n/format';
import { de } from './de';
import { en } from './en';

type Tree = { [key: string]: string | Tree };

// Flattens nested messages to "section.key" → text
const flatten = (tree: Tree, prefix = ''): Record<string, string> =>
  Object.fromEntries(
    Object.entries(tree).flatMap(([key, value]) =>
      typeof value === 'string' ? [[`${prefix}${key}`, value]] : Object.entries(flatten(value, `${prefix}${key}.`)),
    ),
  );

const german = flatten(de);
const english = flatten(en);

describe('messages', () => {
  test('both languages have the same keys', () => {
    expect(Object.keys(german).toSorted()).toEqual(Object.keys(english).toSorted());
  });

  test('both languages use the same placeholders', () => {
    for (const key of Object.keys(german)) {
      expect(placeholders(german[key]), key).toEqual(placeholders(english[key]));
    }
  });

  test('no message is empty', () => {
    for (const [key, value] of Object.entries({ ...german, ...english })) {
      expect(value.trim(), key).not.toBe('');
    }
  });

  test('German uses Swiss spelling without ß', () => {
    for (const [key, value] of Object.entries(german)) {
      expect(value, key).not.toContain('ß');
    }
  });
});
