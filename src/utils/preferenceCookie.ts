import { parseMapCenter } from '@/utils/parseMapCenter';

const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;
const LAYERS = new Set(['Wind', 'Temperature', 'Webcams']);

// Prefixed names: the previous cookies were httpOnly, which document.cookie can't overwrite
export const MAP_CENTER_LAT_COOKIE = 'mapCenterLat';
export const MAP_CENTER_LON_COOKIE = 'mapCenterLon';
export const MAP_ZOOM_COOKIE = 'mapZoom';
export const layerCookieName = (layer: string) => `layer${layer}`;

// Written on the client so map interactions don't trigger a Server Action and a server re-render;
// the cookies are only read during the initial server render in page.tsx
const setPreferenceCookie = (name: string, value: string) => {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  // biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API is missing on older iOS Safari
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${ONE_YEAR_IN_SECONDS}; SameSite=Lax${secure}`;
};

export const saveCenterToCookie = (centerLat: string, centerLon: string, zoom: string) => {
  const center = parseMapCenter(centerLat, centerLon, zoom);

  if (!center) {
    return;
  }

  setPreferenceCookie(MAP_CENTER_LAT_COOKIE, center.centerLat);
  setPreferenceCookie(MAP_CENTER_LON_COOKIE, center.centerLon);
  setPreferenceCookie(MAP_ZOOM_COOKIE, center.zoom);
};

export const saveLayerToCookie = (layer: string, isActive: boolean) => {
  if (!LAYERS.has(layer)) {
    return;
  }

  setPreferenceCookie(layerCookieName(layer), isActive.toString());
};
