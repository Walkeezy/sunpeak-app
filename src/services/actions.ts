// app/actions.ts
'use server';

import { getTemperatureData } from './temperatureData';

export async function refreshData() {
  const temperatureData = await getTemperatureData();

  return { temperatureData };
}
