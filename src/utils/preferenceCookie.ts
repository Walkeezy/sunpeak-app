import { hasLocale, LOCALE_COOKIE, type Locale } from '@/i18n/config';
import { DEFAULT_LAYER_VISIBILITY, isLayerName, LAYERS, type LayerVisibility } from '@/layers';
import { parseMapCenter } from '@/utils/parseMapCenter';

const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;

// Prefixed names: the previous cookies were httpOnly, which document.cookie can't overwrite
export const MAP_CENTER_LAT_COOKIE = 'mapCenterLat';
export const MAP_CENTER_LON_COOKIE = 'mapCenterLon';
export const MAP_ZOOM_COOKIE = 'mapZoom';
const layerCookieName = (layer: string) => `layer${layer}`;

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

// Read during the server render: a saved choice per layer, the default otherwise
export const layerVisibilityFromCookies = (readCookie: (name: string) => string | undefined): LayerVisibility =>
  Object.fromEntries(
    LAYERS.map((layer) => {
      const saved = readCookie(layerCookieName(layer));

      return [layer, saved === undefined ? DEFAULT_LAYER_VISIBILITY[layer] : saved === 'true'];
    }),
  ) as LayerVisibility;

export const saveLayerToCookie = (layer: string, isActive: boolean) => {
  if (!isLayerName(layer)) {
    return;
  }

  setPreferenceCookie(layerCookieName(layer), isActive.toString());
};

// Read by the proxy when a visitor opens an unprefixed URL such as /
export const saveLocaleToCookie = (locale: Locale) => {
  if (!hasLocale(locale)) {
    return;
  }

  setPreferenceCookie(LOCALE_COOKIE, locale);
};
