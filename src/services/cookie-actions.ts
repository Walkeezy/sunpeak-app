'use server';

import { cookies } from 'next/headers';

const ONE_YEAR_FROM_TODAY = Date.now() + 365 * 24 * 60 * 60 * 1000;

const COOKIE_OPTIONS = {
  expires: new Date(ONE_YEAR_FROM_TODAY),
};

export const saveCenterToCookie = (centerLat: string, centerLon: string, zoom: string) => {
  cookies().set('centerLat', centerLat, COOKIE_OPTIONS);
  cookies().set('centerLon', centerLon, COOKIE_OPTIONS);
  cookies().set('zoom', zoom, COOKIE_OPTIONS);
};

export const saveLayerToCookie = (layer: string, isActive: boolean) => {
  // expire the cookie in 1 year
  cookies().set(layer, isActive.toString(), COOKIE_OPTIONS);
};
