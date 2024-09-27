'use server';

import { getTemperatureData } from './temperatureData';
import { getWindData } from './windData';

export async function getData() {
  const temperatureData = await getTemperatureData();
  const windData = await getWindData();

  return { windData, temperatureData };
}
