import { FETCH_TIMEOUT_MS } from '@/config';
import { fetchMeasurementData, type Measurement } from './measurementData';

export type Wind = Measurement & { direction?: number };
export type WindData = Wind[];

const WIND_URL =
  'https://data.geo.admin.ch/ch.meteoschweiz.messwerte-wind-boeenspitze-kmh-10min/ch.meteoschweiz.messwerte-wind-boeenspitze-kmh-10min_de.json';

const WIND_DIRECTION_URL = 'https://data.geo.admin.ch/ch.meteoschweiz.messwerte-aktuell/VQHA80.csv';

export function parseWindDirections(csv: string): Map<string, number> {
  const lines = csv
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const headerIndex = lines.findIndex((line) => line.includes('dkl010z0'));
  if (headerIndex === -1) {
    return new Map();
  }

  const header = lines[headerIndex].split(';').map((column) => column.trim());
  const directionIndex = header.indexOf('dkl010z0');
  const directions = new Map<string, number>();

  for (const line of lines.slice(headerIndex + 1)) {
    const columns = line.split(';');
    const id = columns[0]?.trim();
    const raw = columns[directionIndex]?.trim();

    if (!id || raw == null || raw === '-') {
      continue;
    }

    const direction = Number(raw);
    if (!Number.isFinite(direction)) {
      continue;
    }

    directions.set(id, direction);
  }

  return directions;
}

async function fetchWindDirections(): Promise<Map<string, number>> {
  const response = await fetch(WIND_DIRECTION_URL, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    next: { revalidate: 600, tags: ['measurements'] },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch wind direction data: ${response.status}`);
  }

  return parseWindDirections(await response.text());
}

export async function getWindData(): Promise<WindData> {
  const [gusts, directions] = await Promise.all([
    fetchMeasurementData(WIND_URL),
    fetchWindDirections().catch((error: unknown) => {
      console.error(error);

      return new Map<string, number>();
    }),
  ]);

  return gusts.map((gust) => {
    const direction = directions.get(gust.id);

    return direction === undefined ? gust : { ...gust, direction };
  });
}
