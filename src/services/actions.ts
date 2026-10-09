'use server';

import { loadSourceData } from './sourceData';

// Serves the time-based cache (webcams hourly, measurements every 10 minutes) instead of
// expiring it, since any visitor can call this action
export async function getData() {
  return loadSourceData();
}
