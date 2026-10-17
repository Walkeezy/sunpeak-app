import { ALTITUDE_STEPS } from '@/config';
import type { Station } from '@/services/stationData';

export type FogBoundary = {
  // sun: low stations in the shade, higher ones in the sun. inversion: warmer above colder valleys
  kind: 'sun' | 'inversion';
  // Lower edge of the first altitude band above the boundary, in metres
  altitude: number;
};

const BAND_HEIGHT = 250;
const MIN_STATIONS_PER_BAND = 2;
// Median minutes of sunshine out of ten
const SUNNY_MINUTES = 5;
const DARK_MINUTES = 1;
// Stations below this form the lowland reference for an inversion
const LOWLAND_TOP = 750;
const INVERSION_SEARCH_TOP = 2500;
// Normally the air cools by about 0.65 °C per 100 m; being this much warmer than the lowlands is clearly inverted
const INVERSION_WARMER_BY = 2;

const median = (values: number[]): number => {
  const sorted = values.toSorted((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 1 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

type Band = { bottom: number; median: number };

// Groups stations into altitude bands and takes the median value of each band with enough stations
const bands = (stations: Station[], value: (station: Station) => number | undefined): Band[] => {
  const groups = new Map<number, number[]>();

  for (const station of stations) {
    const measured = value(station);

    if (station.altitude === undefined || measured === undefined) {
      continue;
    }

    const bottom = Math.floor(station.altitude / BAND_HEIGHT) * BAND_HEIGHT;
    groups.set(bottom, [...(groups.get(bottom) ?? []), measured]);
  }

  return [...groups]
    .filter(([, values]) => values.length >= MIN_STATIONS_PER_BAND)
    .map(([bottom, values]) => ({ bottom, median: median(values) }))
    .toSorted((a, b) => a.bottom - b.bottom);
};

const isSunny = (band: Band | undefined) => band !== undefined && band.median >= SUNNY_MINUTES;
const isShaded = (band: Band | undefined) => band !== undefined && band.median <= DARK_MINUTES;

// The lowest band where the sun starts for good: a shaded band right below, mostly shade further down
// (a fog top is rarely level, so a mixed band may sit in between), the next band up sunny too, and mostly
// sun above
const sunBoundary = (stations: Station[]): number | undefined => {
  const sunshine = bands(stations, (station) => station.sunshine);

  for (let index = 1; index < sunshine.length; index++) {
    const below = sunshine.slice(0, index);
    const above = sunshine.slice(index);
    const isShadedBelow = isShaded(below.at(-1)) && below.filter(isShaded).length * 3 >= below.length * 2;
    const isSunnyAbove =
      isSunny(above[0]) && (above.length === 1 || isSunny(above[1])) && above.filter(isSunny).length * 2 >= above.length;

    if (isShadedBelow && isSunnyAbove) {
      return sunshine[index].bottom;
    }
  }

  return undefined;
};

// The lowest band clearly warmer than the lowlands below it
const inversionBoundary = (stations: Station[]): number | undefined => {
  const lowland = stations.flatMap(({ altitude, temperature }) =>
    altitude !== undefined && temperature !== undefined && altitude < LOWLAND_TOP ? [temperature] : [],
  );

  if (lowland.length < MIN_STATIONS_PER_BAND) {
    return undefined;
  }

  const reference = median(lowland);

  return bands(stations, (station) => station.temperature).find(
    ({ bottom, median: temperature }) =>
      bottom >= LOWLAND_TOP && bottom < INVERSION_SEARCH_TOP && temperature >= reference + INVERSION_WARMER_BY,
  )?.bottom;
};

// The altitude filter step that hides what lies below the boundary
export const altitudeStepFor = (boundary: number): number =>
  ALTITUDE_STEPS.find((step) => step > 0 && step >= boundary) ?? Math.max(...ALTITUDE_STEPS);

// Sunshine tells it directly during the day; otherwise the temperature profile hints at fog or haze
export const fogBoundary = (stations: Station[]): FogBoundary | undefined => {
  const sun = sunBoundary(stations);

  if (sun !== undefined) {
    return { kind: 'sun', altitude: sun };
  }

  const inversion = inversionBoundary(stations);

  return inversion === undefined ? undefined : { kind: 'inversion', altitude: inversion };
};
