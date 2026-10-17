import { settle } from './sourceResult';
import { getSunshineData, type SunshineData } from './sunshineData';
import { getTemperatureData, type TemperatureData } from './temperatureData';
import { getWebcamData, type WebcamData } from './webcamData';
import { getWindData, type WindData } from './windData';

export type SourceData = {
  webcamData: WebcamData;
  temperatureData: TemperatureData;
  windData: WindData;
  sunshineData: SunshineData;
  webcamOk: boolean;
  temperatureOk: boolean;
  windOk: boolean;
  sunshineOk: boolean;
};

export async function loadSourceData(): Promise<SourceData> {
  const [webcams, temperatures, winds, sunshine] = await Promise.all([
    settle(getWebcamData(), []),
    settle(getTemperatureData(), []),
    settle(getWindData(), []),
    settle(getSunshineData(), []),
  ]);

  return {
    webcamData: webcams.data,
    temperatureData: temperatures.data,
    windData: winds.data,
    sunshineData: sunshine.data,
    webcamOk: webcams.ok,
    temperatureOk: temperatures.ok,
    windOk: winds.ok,
    sunshineOk: sunshine.ok,
  };
}
