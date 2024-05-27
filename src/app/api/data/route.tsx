import { getTemperatureData } from '../../../services/temperatureData';
import { getWindData } from '../../../services/windData';

export async function GET() {
  try {
    const temperatureData = await getTemperatureData();
    const windData = await getWindData();
    if (temperatureData) {
      return new Response(JSON.stringify({ temperatureData, windData }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    throw new Error('Error fetching data.');
  } catch (error) {
    console.error(error);

    return new Response('Error fetching data', { status: 500 });
  }
}
