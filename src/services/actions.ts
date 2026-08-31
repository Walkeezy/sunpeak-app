'use server';

import { updateTag } from 'next/cache';
import { settle } from './sourceResult';
import { getTemperatureData } from './temperatureData';
import { getWebcamData } from './webcamData';
import { getWindData } from './windData';

export async function getData() {
  updateTag('measurements');
  updateTag('webcams');

  const [webcams, temperatures, winds] = await Promise.all([
    settle(getWebcamData(), []),
    settle(getTemperatureData(), []),
    settle(getWindData(), []),
  ]);

  return {
    webcamData: webcams.data,
    temperatureData: temperatures.data,
    windData: winds.data,
    webcamOk: webcams.ok,
    temperatureOk: temperatures.ok,
    windOk: winds.ok,
  };
}
