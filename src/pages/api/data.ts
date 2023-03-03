import { NextApiRequest, NextApiResponse } from 'next';
import { getTemperatureData } from 'src/services/weatherData';
import { getWebcamData } from '../../services/webcamData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const webcamData = await getWebcamData();
    const temperatureData = await getTemperatureData();
    if (webcamData && temperatureData) {
      res.status(200).json({ webcamData, temperatureData });
    } else {
      throw new Error('Error fetching data.');
    }
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
}
