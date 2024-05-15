import { getTemperatureData } from '../../../services/weatherData';
import { getWebcamData } from '../../../services/webcamData';

export async function GET() {
  try {
    const webcamData = await getWebcamData();
    const temperatureData = await getTemperatureData();
    if (webcamData && temperatureData) {
      return new Response(JSON.stringify({ webcamData, temperatureData }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    throw new Error('Error fetching data.');
  } catch (error) {
    console.error(error);

    return new Response('Error fetching data', { status: 500 });
  }
}
