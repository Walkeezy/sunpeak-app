import { LatLngTuple } from 'leaflet';

// ZOOM
export const INITIAL_ZOOM = 10;
export const MIN_ZOOM = 8;
export const MAX_ZOOM = 14;

// COORDINATES
export const INITIAL_CENTER = [46.85, 9.533333] as LatLngTuple;
const CORNER_1 = [45.6, 5.7] as LatLngTuple;
const CORNER_2 = [48, 10.8] as LatLngTuple;
export const MAX_BOUNDS = [CORNER_1, CORNER_2] as LatLngTuple[];
