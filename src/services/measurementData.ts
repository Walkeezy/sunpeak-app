import { unstable_noStore as noStore } from 'next/cache';
import proj4 from 'proj4';

export type Measurement = {
  id: string;
  latitude: number;
  longitude: number;
  value: number;
};

type GeoAdminFeature = {
  id: string;
  geometry: { coordinates: [number, number] };
  properties: { value: number };
};

type GeoAdminResponse = {
  features?: GeoAdminFeature[];
};

// Swiss coordinate system used by geo.admin.ch (EPSG:2056)
proj4.defs(
  'LV95',
  '+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs',
);

export async function fetchMeasurementData(url: string): Promise<Measurement[]> {
  noStore();

  try {
    const response = await fetch(url);
    const data = (await response.json()) as GeoAdminResponse;

    return (data.features ?? []).map((feature) => {
      const [longitude, latitude] = proj4('LV95', 'WGS84', feature.geometry.coordinates);

      return {
        id: feature.id,
        latitude,
        longitude,
        value: feature.properties.value,
      };
    });
  } catch (err) {
    console.error(err);

    return [];
  }
}
