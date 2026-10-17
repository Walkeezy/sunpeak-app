import { describe, expect, test } from 'vitest';
import type { Webcam } from '@/services/webcamData';
import { altitudeRange, centralWebcam, findPlace, groupByPlace, nearbyPlaces, nearestWebcams, placeSlugOf } from './places';

const webcam = (overrides: Partial<Webcam>): Webcam => ({
  slug: 'webcam',
  name: 'Webcam',
  city: '',
  latitude: 46.85,
  longitude: 9.53,
  thumbnail: 'https://example.com/thumb.jpg',
  fullsize: 'https://example.com/full.jpg',
  link: 'https://example.com',
  panorama: false,
  ...overrides,
});

const rothorn = webcam({
  slug: 'rothorn-lenzerheide',
  name: 'Rothorn',
  city: 'Lenzerheide',
  latitude: 46.75,
  longitude: 9.57,
  altitude: 2865,
});
const heidsee = webcam({
  slug: 'heidsee-lenzerheide',
  name: 'Heidsee',
  city: 'Lenzerheide ',
  latitude: 46.73,
  longitude: 9.55,
  altitude: 1484,
});
const weisshorn = webcam({
  slug: 'weisshorn-arosa',
  name: 'Weisshorn',
  city: 'Arosa',
  latitude: 46.79,
  longitude: 9.65,
  altitude: 2653,
});
const titlis = webcam({ slug: 'titlis-engelberg', name: 'Titlis', city: 'Engelberg', latitude: 46.77, longitude: 8.44 });
const nowhere = webcam({ slug: 'nowhere', name: 'Nowhere', city: ' ', latitude: 47, longitude: 8 });

describe('placeSlugOf', () => {
  test('slugifies the town', () => {
    expect(placeSlugOf({ city: 'St. Moritz' })).toBe('st-moritz');
    expect(placeSlugOf({ city: '' })).toBe('');
  });
});

describe('groupByPlace', () => {
  test('groups webcams by town in order of appearance', () => {
    const { places, elsewhere } = groupByPlace([rothorn, weisshorn, heidsee, titlis, nowhere]);

    expect(places.map(({ slug, name, webcams }) => [slug, name, webcams.map((w) => w.slug)])).toEqual([
      ['lenzerheide', 'Lenzerheide', ['rothorn-lenzerheide', 'heidsee-lenzerheide']],
      ['arosa', 'Arosa', ['weisshorn-arosa']],
      ['engelberg', 'Engelberg', ['titlis-engelberg']],
    ]);
    expect(elsewhere).toEqual([nowhere]);
  });

  test('merges spellings with the same slug under the first one', () => {
    const { places } = groupByPlace([webcam({ slug: 'a', city: 'St. Moritz' }), webcam({ slug: 'b', city: 'St.Moritz' })]);

    expect(places).toHaveLength(1);
    expect(places[0].name).toBe('St. Moritz');
    expect(places[0].webcams.map((w) => w.slug)).toEqual(['a', 'b']);
  });

  test('centres a place between its webcams', () => {
    const { places } = groupByPlace([rothorn, heidsee]);

    expect(places[0].latitude).toBeCloseTo(46.74);
    expect(places[0].longitude).toBeCloseTo(9.56);
  });
});

describe('findPlace', () => {
  test('finds a place by slug', () => {
    const { places } = groupByPlace([rothorn, weisshorn]);

    expect(findPlace(places, 'arosa')?.name).toBe('Arosa');
    expect(findPlace(places, 'zermatt')).toBeUndefined();
  });
});

describe('nearbyPlaces', () => {
  test('lists the other places closest first, up to the limit', () => {
    const { places } = groupByPlace([rothorn, heidsee, weisshorn, titlis]);
    const [lenzerheide] = places;

    const nearby = nearbyPlaces(lenzerheide, places, 5);

    expect(nearby.map(({ slug }) => slug)).toEqual(['arosa', 'engelberg']);
    expect(nearby[0].distanceKm).toBeGreaterThan(5);
    expect(nearby[0].distanceKm).toBeLessThan(15);
    expect(nearbyPlaces(lenzerheide, places, 1).map(({ slug }) => slug)).toEqual(['arosa']);
  });
});

describe('nearestWebcams', () => {
  test('lists the other webcams closest first, up to the limit', () => {
    const nearest = nearestWebcams(rothorn, [rothorn, heidsee, weisshorn, titlis], 2);

    expect(nearest.map(({ slug }) => slug)).toEqual(['heidsee-lenzerheide', 'weisshorn-arosa']);
    expect(nearest[0].distanceKm).toBeLessThan(3);
  });
});

describe('altitudeRange', () => {
  test('spans the known altitudes', () => {
    expect(altitudeRange([rothorn, heidsee, titlis])).toEqual({ min: 1484, max: 2865 });
  });

  test('is undefined without any altitude', () => {
    expect(altitudeRange([titlis])).toBeUndefined();
  });
});

describe('centralWebcam', () => {
  test('picks the webcam nearest to the middle of the place', () => {
    const far = webcam({ slug: 'far', city: 'Lenzerheide', latitude: 46.9, longitude: 9.57 });
    const { places } = groupByPlace([rothorn, heidsee, far]);

    expect(centralWebcam(places[0]).slug).toBe('rothorn-lenzerheide');
  });
});
