import proj4 from 'proj4';
import { FETCH_TIMEOUT_MS } from '@/config';

export type Measurement = {
  id: string;
  latitude: number;
  longitude: number;
  value: number;
  stationName?: string;
  measuredAt?: string;
};

type GeoAdminFeature = {
  id: string;
  geometry: { coordinates: [number, number] };
  properties: { value: number; station_name?: string; reference_ts?: string };
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

  return (data.features ?? []).map((feature) => {
    const [longitude, latitude] = lv95ToWgs84.forward(feature.geometry.coordinates);

    return {
      id: feature.id,
      latitude,
      longitude,
      value: feature.properties.value,
      stationName: feature.properties.station_name,
      measuredAt: feature.properties.reference_ts,
    };
  });
}
