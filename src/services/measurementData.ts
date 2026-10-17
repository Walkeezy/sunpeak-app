import proj4 from 'proj4';
import { FETCH_TIMEOUT_MS } from '@/config';

export type Measurement = {
  id: string;
  latitude: number;
  longitude: number;
  value: number;
  stationName?: string;
  measuredAt?: string;
  // Metres above sea level
  altitude?: number;
  // Where the wind comes from, in degrees (wind datasets only)
  direction?: number;
};

type GeoAdminFeature = {
  id: string;
  geometry: { coordinates: [number, number] };
  properties: {
    value: number;
    station_name?: string;
    reference_ts?: string;
    altitude?: string | number;
    wind_direction?: number | null;
  };
};

const finiteOrUndefined = (value: string | number | null | undefined): number | undefined => {
  const number = typeof value === 'string' ? Number.parseFloat(value) : value;

  return typeof number === 'number' && Number.isFinite(number) ? number : undefined;
};

type GeoAdminResponse = {
  features?: GeoAdminFeature[];
};

// Swiss coordinate system used by geo.admin.ch (EPSG:2056)
proj4.defs(
  'LV95',
  '+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs',
);

// Built once: proj4(from, to, coordinates) would parse both definitions again for every feature
const lv95ToWgs84 = proj4('LV95', 'WGS84');

export async function fetchMeasurementData(url: string): Promise<Measurement[]> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    next: { revalidate: 600, tags: ['measurements'] },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch measurement data: ${response.status}`);
  }

  const data = (await response.json()) as GeoAdminResponse;

  return (data.features ?? []).map(({ id, geometry, properties }) => {
    const [longitude, latitude] = lv95ToWgs84.forward(geometry.coordinates);
    const altitude = finiteOrUndefined(properties.altitude);
    const direction = finiteOrUndefined(properties.wind_direction);

    return {
      id,
      latitude,
      longitude,
      value: properties.value,
      stationName: properties.station_name,
      measuredAt: properties.reference_ts,
      // Left out rather than undefined, so the client payload stays small
      ...(altitude === undefined ? {} : { altitude }),
      ...(direction === undefined ? {} : { direction }),
    };
  });
}
