'use server';

import { cookies } from 'next/headers';

const ONE_YEAR_IN_MS = 365 * 24 * 60 * 60 * 1000;

const cookieOptions = () => ({
  expires: new Date(Date.now() + ONE_YEAR_IN_MS),
});

export const saveCenterToCookie = async (centerLat: string, centerLon: string, zoom: string) => {
  const cookieStore = await cookies();
  const options = cookieOptions();
  cookieStore.set('centerLat', centerLat, options);
  cookieStore.set('centerLon', centerLon, options);
  cookieStore.set('zoom', zoom, options);
};

export const saveLayerToCookie = async (layer: string, isActive: boolean) => {
  (await cookies()).set(layer, isActive.toString(), cookieOptions());
};
