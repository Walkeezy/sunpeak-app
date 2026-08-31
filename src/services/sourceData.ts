import { settle } from './sourceResult';
import { getTemperatureData, type TemperatureData } from './temperatureData';
import { getWebcamData, type WebcamData } from './webcamData';
import { getWindData, type WindData } from './windData';

export type SourceData = {
  webcamData: WebcamData;
  temperatureData: TemperatureData;
  windData: WindData;
  webcamOk: boolean;
  temperatureOk: boolean;
  windOk: boolean;
};

export async function loadSourceData(): Promise<SourceData> {
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
