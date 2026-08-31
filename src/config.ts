import type { LatLngTuple } from 'leaflet';

export const FETCH_TIMEOUT_MS = 8_000;

// ZOOM
export const INITIAL_ZOOM = 10;
export const MIN_ZOOM = 9;
export const MAX_ZOOM = 13;

export const camIconSize = (zoom: number): number => {
  if (zoom <= 10) {
    return 36;
  }
  if (zoom <= 11) {
    return 42;
  }
  if (zoom <= 12) {
    return 56;
  }
  if (zoom <= 13) {
    return 64;
  }

  return 72;
};

// COORDINATES
export const INITIAL_CENTER = [46.85, 9.533333] as LatLngTuple;
const CORNER_1 = [45.6, 5.7] as LatLngTuple;
const CORNER_2 = [48, 10.8] as LatLngTuple;
export const MAX_BOUNDS = [CORNER_1, CORNER_2] as LatLngTuple[];
