'use server';

import { cookies } from 'next/headers';
import { parseMapCenter } from '@/utils/parseMapCenter';

const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;
const LAYER_COOKIES = new Set(['Wind', 'Temperature', 'Webcams']);

const cookieOptions = () => ({
  expires: new Date(Date.now() + ONE_YEAR_IN_MS),
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
});

export const saveCenterToCookie = async (centerLat: string, centerLon: string, zoom: string) => {
  const center = parseMapCenter(centerLat, centerLon, zoom);

  if (!center) {
    return;
  }

  const cookieStore = await cookies();
  const options = cookieOptions();
  cookieStore.set('centerLat', center.centerLat, options);
  cookieStore.set('centerLon', center.centerLon, options);
  cookieStore.set('zoom', center.zoom, options);
};

export const saveLayerToCookie = async (layer: string, isActive: boolean) => {
  if (!LAYER_COOKIES.has(layer)) {
    return;
  }

  (await cookies()).set(layer, isActive.toString(), cookieOptions());
};
