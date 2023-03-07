import proj4 from 'proj4';

export type TemperatureData = Temperature[];

export type Temperature = {
  id: string;
  latitude: number;
  longitude: number;
  value: number;
};

export async function getTemperatureData(): Promise<TemperatureData | []> {
  proj4.defs(
    'LV95',
    '+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs'
  );

  try {
    const response = await fetch(
      'https://data.geo.admin.ch/ch.meteoschweiz.messwerte-lufttemperatur-10min/ch.meteoschweiz.messwerte-lufttemperatur-10min_de.json'
    );
    const data = await response.json();

    if (data && data.features.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const temperatureData = data.features.map((feature: any) => {
        const convertedCoordiantes = proj4('LV95', 'WGS84', [
          feature.geometry.coordinates[0],
          feature.geometry.coordinates[1],
        ]);
        return {
          id: feature.id,
          latitude: convertedCoordiantes[1],
          longitude: convertedCoordiantes[0],
          value: feature.properties.value,
        };
      });

      // Filter out temperatures that are don't make sense
      const filteredTemperatureData = temperatureData.filter(
        (temperature: Temperature) => temperature.value > -50 && temperature.value < 50
      );

      return filteredTemperatureData;
    }

    return [];
  } catch (err) {
    console.log(err);
    return [];
  }
}
