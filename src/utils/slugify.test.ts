import { describe, expect, test } from 'vitest';
import { slugify, uniqueSlugs } from './slugify';

describe('slugify', () => {
  test('lowercases and joins words with dashes', () => {
    expect(slugify('Pizol  Laufböden')).toBe('pizol-laufboeden');
  });

  test('transliterates German umlauts the Swiss way', () => {
    expect(slugify('Zürich Üetliberg')).toBe('zuerich-ueetliberg');
    expect(slugify('Grosser Mythen Schwyz')).toBe('grosser-mythen-schwyz');
  });

  test('strips French and Italian accents', () => {
    expect(slugify('Neuchâtel Genève')).toBe('neuchatel-geneve');
    expect(slugify('Lugano Monte Brè')).toBe('lugano-monte-bre');
  });

  test('drops punctuation and dashes at the edges', () => {
    expect(slugify(' (Säntis) - Schwägalp / Nord ')).toBe('saentis-schwaegalp-nord');
  });

  test('returns an empty string when nothing is left', () => {
    expect(slugify('***')).toBe('');
  });
});

describe('uniqueSlugs', () => {
  test('keeps distinct slugs as they are', () => {
    expect(uniqueSlugs(['Säntis', 'Pilatus'])).toEqual(['saentis', 'pilatus']);
  });

  test('numbers duplicates in input order', () => {
    expect(uniqueSlugs(['Dorf', 'Dorf', 'Dorf'])).toEqual(['dorf', 'dorf-2', 'dorf-3']);
  });

  test('falls back to a generic slug for empty names', () => {
    expect(uniqueSlugs(['', '!!'])).toEqual(['webcam', 'webcam-2']);
  });
});
