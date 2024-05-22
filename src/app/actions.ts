'use server';

import { cookies } from 'next/headers';

export const saveCenterToCookie = (centerLat: string, centerLon: string, zoom: string) => {
  cookies().set('centerLat', centerLat);
  cookies().set('centerLon', centerLon);
  cookies().set('zoom', zoom);
};
