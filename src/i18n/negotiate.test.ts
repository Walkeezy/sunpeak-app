import { describe, expect, test } from 'vitest';
import { negotiateLocale } from './negotiate';

describe('negotiateLocale', () => {
  test('returns undefined without a header', () => {
    expect(negotiateLocale(null)).toBeUndefined();
    expect(negotiateLocale('')).toBeUndefined();
  });

  test('matches regional variants by their primary subtag', () => {
    expect(negotiateLocale('de-CH')).toBe('de');
    expect(negotiateLocale('en-GB,en;q=0.9')).toBe('en');
  });

  test('follows the quality values', () => {
    expect(negotiateLocale('en;q=0.5,de;q=0.8')).toBe('de');
    expect(negotiateLocale('fr-CH,fr;q=0.9,en;q=0.8,de;q=0.7')).toBe('en');
  });

  test('keeps the browser order for equal qualities', () => {
    expect(negotiateLocale('en,de')).toBe('en');
  });

  test('ignores languages with q=0 and unsupported ones', () => {
    expect(negotiateLocale('de;q=0,en;q=0.1')).toBe('en');
    expect(negotiateLocale('fr,it')).toBeUndefined();
  });

  test('tolerates whitespace and malformed quality values', () => {
    expect(negotiateLocale(' fr ; q=0.9 ,  de ; q=abc , en ; q=0.2')).toBe('en');
  });
});
