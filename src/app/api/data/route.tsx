import { getTemperatureData } from '../../../services/weatherData';

export async function GET() {
  try {
    const temperatureData = await getTemperatureData();
    if (temperatureData) {
      return new Response(JSON.stringify({ temperatureData }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    throw new Error('Error fetching data.');
  } catch (error) {
    console.error(error);

    return new Response('Error fetching data', { status: 500 });
  }
}
