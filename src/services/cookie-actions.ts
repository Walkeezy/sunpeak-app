'use server';

import { cookies } from 'next/headers';

const ONE_YEAR_FROM_TODAY = Date.now() + 365 * 24 * 60 * 60 * 1000;

const COOKIE_OPTIONS = {
  expires: new Date(ONE_YEAR_FROM_TODAY),
};

export const saveCenterToCookie = async (centerLat: string, centerLon: string, zoom: string) => {
  (await cookies()).set('centerLat', centerLat, COOKIE_OPTIONS);
  (await cookies()).set('centerLon', centerLon, COOKIE_OPTIONS);
  (await cookies()).set('zoom', zoom, COOKIE_OPTIONS);
};

export const saveLayerToCookie = async (layer: string, isActive: boolean) => {
  // expire the cookie in 1 year
  (await cookies()).set(layer, isActive.toString(), COOKIE_OPTIONS);
};
