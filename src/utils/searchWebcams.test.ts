import { describe, expect, test } from 'vitest';
import type { Webcam } from '@/services/webcamData';
import { groupByPlace } from './places';
import { MAX_SEARCH_RESULTS, searchWebcams } from './searchWebcams';

const webcam = (name: string, city: string): Webcam => ({
  slug: `${city}-${name}`.toLowerCase(),
  name,
  city,
  latitude: 46.8,
  longitude: 9.5,
  thumbnail: 'https://example.com/t.jpg',
  fullsize: 'https://example.com/f.jpg',
  link: 'https://example.com',
  panorama: false,
});

const webcams = [
  webcam('Rothorn', 'Lenzerheide'),
  webcam('Heidbüel', 'Lenzerheide'),
  webcam('Jakobshorn', 'Davos'),
  webcam('Uetliberg', 'Zürich'),
  webcam('Blick nach Davos', 'Klosters'),
];
const { places } = groupByPlace(webcams);

const names = (query: string) =>
  searchWebcams(query, webcams, places).map((result) =>
    result.kind === 'place' ? `place:${result.place.name}` : `webcam:${result.webcam.name}`,
  );

describe('searchWebcams', () => {
  test('finds nothing for an empty query', () => {
    expect(names('')).toEqual([]);
    expect(names('   ')).toEqual([]);
  });

  test('matches places and webcams by name, places first', () => {
    expect(names('davos')).toEqual(['place:Davos', 'webcam:Blick nach Davos']);
  });

  test('ignores case and accents', () => {
    expect(names('ZURICH')).toEqual(['place:Zürich']);
    expect(names('heidbuel')).toEqual(['webcam:Heidbüel']);
    expect(names('heidbü')).toEqual(['webcam:Heidbüel']);
  });

  test('ranks matches at the start of the name before matches inside it', () => {
    expect(names('horn')).toEqual(['webcam:Jakobshorn', 'webcam:Rothorn']);
    expect(names('ro')).toEqual(['webcam:Rothorn']);
  });

  test('returns at most the result limit', () => {
    const many = Array.from({ length: 20 }, (_, index) => webcam(`Alp ${index}`, `Ort ${index}`));

    expect(searchWebcams('alp', many, groupByPlace(many).places)).toHaveLength(MAX_SEARCH_RESULTS);
  });
});
