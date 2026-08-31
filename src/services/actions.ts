'use server';

import { updateTag } from 'next/cache';
import { loadSourceData } from './sourceData';

export async function getData() {
  updateTag('measurements');
  updateTag('webcams');

  return loadSourceData();
}
