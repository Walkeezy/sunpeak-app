import { Metadata } from 'next';
import { getTemperatureData } from '../services/weatherData';
import { getWebcamData } from '../services/webcamData';
import { SunpeakApp } from './app';

export const metadata: Metadata = {
  title: 'Sunpeak App — Webcams from all over Switzerland',
  description:
    "This interactive map displays webcams from all over Switzerland, giving you a real-time glimpse of the current weather conditions and helping you plan your next outdoor adventure. So why wait? Let's find out where the sun is shining today!",
};

export default async function Page() {
  const webcamData = await getWebcamData();
  const temperatureData = await getTemperatureData();

  return <SunpeakApp webcamData={webcamData} temperatureData={temperatureData} />;
}
