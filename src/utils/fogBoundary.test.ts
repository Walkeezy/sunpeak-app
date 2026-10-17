import { describe, expect, test } from 'vitest';
import type { Station } from '@/services/stationData';
import { altitudeStepFor, fogBoundary } from './fogBoundary';

let id = 0;
const station = (altitude: number, values: Partial<Station>): Station => ({
  id: `S${id++}`,
  latitude: 47,
  longitude: 8,
  altitude,
  ...values,
});

// Two stations per altitude, so every band has a median
const profile = (rows: [altitude: number, values: Partial<Station>][]) =>
  rows.flatMap(([altitude, values]) => [station(altitude, values), station(altitude + 50, values)]);

describe('fogBoundary', () => {
  test('finds the sun above a fog layer', () => {
    const stations = profile([
      [300, { sunshine: 0, temperature: 4 }],
      [500, { sunshine: 0, temperature: 4 }],
      [800, { sunshine: 1, temperature: 5 }],
      [1050, { sunshine: 10, temperature: 11 }],
      [1550, { sunshine: 10, temperature: 9 }],
      [2050, { sunshine: 8, temperature: 6 }],
    ]);

    expect(fogBoundary(stations)).toEqual({ kind: 'sun', altitude: 1000 });
  });

  test('looks past a patchy band at the top of the fog', () => {
    // Shaped like 17 October 2026 at noon: shade below 750 m, a mixed band, shade again, then sun from 1250 m
    const stations = profile([
      [300, { sunshine: 0 }],
      [550, { sunshine: 0 }],
      [800, { sunshine: 5 }],
      [1050, { sunshine: 0 }],
      [1300, { sunshine: 10 }],
      [1550, { sunshine: 10 }],
      [1800, { sunshine: 10 }],
    ]);

    expect(fogBoundary(stations)).toEqual({ kind: 'sun', altitude: 1250 });
  });

  test('reports nothing when the sun shines everywhere', () => {
    const stations = profile([
      [300, { sunshine: 10, temperature: 18 }],
      [1050, { sunshine: 10, temperature: 13 }],
      [2050, { sunshine: 10, temperature: 7 }],
    ]);

    expect(fogBoundary(stations)).toBeUndefined();
  });

  test('reports nothing when it is overcast everywhere and temperatures fall with altitude', () => {
    const stations = profile([
      [300, { sunshine: 0, temperature: 9 }],
      [800, { sunshine: 0, temperature: 6 }],
      [1550, { sunshine: 0, temperature: 2 }],
    ]);

    expect(fogBoundary(stations)).toBeUndefined();
  });

  test('ignores a sunny band with sunny lowlands below it', () => {
    const stations = profile([
      [300, { sunshine: 10 }],
      [800, { sunshine: 0 }],
      [1550, { sunshine: 10 }],
    ]);

    expect(fogBoundary(stations)).toBeUndefined();
  });

  test('falls back to the inversion without sunshine, e.g. in the morning', () => {
    const stations = profile([
      [300, { temperature: 3 }],
      [500, { temperature: 3.5 }],
      [800, { temperature: 4 }],
      [1300, { temperature: 8 }],
      [1800, { temperature: 6 }],
    ]);

    expect(fogBoundary(stations)).toEqual({ kind: 'inversion', altitude: 1250 });
  });

  test('needs enough stations per band', () => {
    expect(fogBoundary([station(300, { sunshine: 0 }), station(1100, { sunshine: 10 })])).toBeUndefined();
  });
});

describe('altitudeStepFor', () => {
  test('picks the first filter step at or above the boundary', () => {
    expect(altitudeStepFor(750)).toBe(1000);
    expect(altitudeStepFor(1000)).toBe(1000);
    expect(altitudeStepFor(1250)).toBe(1500);
  });

  test('stays at the highest step above it', () => {
    expect(altitudeStepFor(2250)).toBe(2000);
  });
});
