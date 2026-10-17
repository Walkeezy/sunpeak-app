import { FETCH_TIMEOUT_MS } from '@/config';
import { wgs84ToLv95 } from './measurementData';

const HEIGHT_URL = 'https://api3.geo.admin.ch/rest/services/height';

// Terrain height in metres above sea level from swisstopo's elevation model. Only covers Switzerland
// and Liechtenstein; elsewhere the service answers with an error. Terrain doesn't change, so a
// successful answer is cached for good
export async function getHeight(latitude: number, longitude: number): Promise<number> {
  const [easting, northing] = wgs84ToLv95(latitude, longitude).map(Math.round);
  const response = await fetch(`${HEIGHT_URL}?easting=${easting}&northing=${northing}&sr=2056`, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    cache: 'force-cache',
    next: { revalidate: false, tags: ['heights'] },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch the height of ${easting}/${northing}: ${response.status}`);
  }

  const { height } = (await response.json()) as { height?: string | number };
  const value = typeof height === 'number' ? height : Number.parseFloat(height ?? '');

  if (!Number.isFinite(value)) {
    throw new Error(`No height for ${easting}/${northing}`);
  }

  return Math.round(value);
}
