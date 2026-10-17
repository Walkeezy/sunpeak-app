import type { Webcam } from '@/services/webcamData';
import { distanceInKm } from './nearestMeasurement';
import { slugify } from './slugify';

export type Place = {
  // URL segment of the place's page, derived from the town's name
  slug: string;
  name: string;
  // In the order they were given, so a sorted input stays sorted
  webcams: Webcam[];
  // Centre of the place's webcams, for distances between places
  latitude: number;
  longitude: number;
};

type Grouped = {
  places: Place[];
  // Webcams without a town; they belong to no place
  elsewhere: Webcam[];
};

export type Nearby<T> = T & { distanceKm: number };

// Slug of the place a webcam belongs to; empty when it has no town
export const placeSlugOf = ({ city }: Pick<Webcam, 'city'>): string => slugify(city);

const centre = (webcams: Webcam[]) => ({
  latitude: webcams.reduce((sum, { latitude }) => sum + latitude, 0) / webcams.length,
  longitude: webcams.reduce((sum, { longitude }) => sum + longitude, 0) / webcams.length,
});

// Groups webcams by town. Spellings with the same slug ("St. Moritz", "St.Moritz") share a place, named after the
// first spelling; places come in the order their first webcam appears
export const groupByPlace = (webcams: Webcam[]): Grouped => {
  const groups = new Map<string, { name: string; webcams: Webcam[] }>();
  const elsewhere: Webcam[] = [];

  for (const webcam of webcams) {
    const slug = placeSlugOf(webcam);

    if (!slug) {
      elsewhere.push(webcam);
    } else if (groups.has(slug)) {
      groups.get(slug)?.webcams.push(webcam);
    } else {
      groups.set(slug, { name: webcam.city.trim(), webcams: [webcam] });
    }
  }

  const places = [...groups].map(([slug, { name, webcams: members }]) => ({
    slug,
    name,
    webcams: members,
    ...centre(members),
  }));

  return { places, elsewhere };
};

export const findPlace = (places: Place[], slug: string): Place | undefined => places.find((place) => place.slug === slug);

// The other places, closest first
export const nearbyPlaces = (place: Place, places: Place[], limit: number): Nearby<Place>[] =>
  places
    .filter((candidate) => candidate.slug !== place.slug)
    .map((candidate) => ({
      ...candidate,
      distanceKm: distanceInKm(place.latitude, place.longitude, candidate.latitude, candidate.longitude),
    }))
    .toSorted((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);

// The other webcams, closest first
export const nearestWebcams = (webcam: Webcam, webcams: Webcam[], limit: number): Nearby<Webcam>[] =>
  webcams
    .filter((candidate) => candidate.slug !== webcam.slug)
    .map((candidate) => ({
      ...candidate,
      distanceKm: distanceInKm(webcam.latitude, webcam.longitude, candidate.latitude, candidate.longitude),
    }))
    .toSorted((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);

// Lowest and highest known altitude; undefined when no altitude is known
export const altitudeRange = (webcams: Pick<Webcam, 'altitude'>[]): { min: number; max: number } | undefined => {
  const altitudes = webcams.flatMap(({ altitude }) => (altitude === undefined ? [] : [altitude]));

  return altitudes.length === 0 ? undefined : { min: Math.min(...altitudes), max: Math.max(...altitudes) };
};

// The webcam nearest to the middle of the place, e.g. to open the map there
export const centralWebcam = ({ webcams, latitude, longitude }: Place): Webcam =>
  webcams.reduce((best, candidate) =>
    distanceInKm(latitude, longitude, candidate.latitude, candidate.longitude) <
    distanceInKm(latitude, longitude, best.latitude, best.longitude)
      ? candidate
      : best,
  );
