import type { LatLngTuple } from 'leaflet';

export const SITE_URL = 'https://sunpeak.app';

export const FETCH_TIMEOUT_MS = 8_000;

// MAP TILES: swisstopo's free vector base map, and its raster map for browsers without WebGL 2
export const MAP_STYLE_URL = 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.lightbasemap.vt/style.json';
export const MAP_FALLBACK_TILES_URL =
  'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg';
export const MAP_ATTRIBUTION = '&copy; <a href="https://www.swisstopo.admin.ch/">swisstopo</a>';

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

// The altitude filter's steps in metres; 0 shows everything
export const ALTITUDE_STEPS: readonly number[] = [0, 1000, 1500, 2000];

// COORDINATES
export const INITIAL_CENTER = [46.85, 9.533333] as LatLngTuple;
const CORNER_1 = [45.6, 5.7] as LatLngTuple;
const CORNER_2 = [48, 10.8] as LatLngTuple;
export const MAX_BOUNDS = [CORNER_1, CORNER_2] as LatLngTuple[];
