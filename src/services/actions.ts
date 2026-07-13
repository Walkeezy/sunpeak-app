'use server';

import { getTemperatureData } from './temperatureData';
import { getWindData } from './windData';

export async function getData() {
  const [temperatureData, windData] = await Promise.all([getTemperatureData(), getWindData()]);

  return { windData, temperatureData };
}
