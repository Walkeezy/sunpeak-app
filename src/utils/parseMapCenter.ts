import { MAX_ZOOM, MIN_ZOOM } from '@/config';

export type MapCenter = { centerLat: string; centerLon: string; zoom: string };

export const parseMapCenter = (centerLat?: string, centerLon?: string, zoom?: string): MapCenter | undefined => {
  if (!centerLat || !centerLon || !zoom) {
    return undefined;
  }

  const lat = parseFloat(centerLat);
  const lon = parseFloat(centerLon);
  const parsedZoom = parseInt(zoom, 10);

  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(parsedZoom)) {
    return undefined;
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return undefined;
  }

  if (parsedZoom < MIN_ZOOM || parsedZoom > MAX_ZOOM) {
    return undefined;
  }

  return { centerLat, centerLon, zoom };
};
