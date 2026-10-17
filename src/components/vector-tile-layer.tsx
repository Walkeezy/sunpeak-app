'use client';

import 'maplibre-gl/dist/maplibre-gl.css';
import { type FC, useEffect, useState } from 'react';
import { TileLayer, useMap } from 'react-leaflet';
import { type Maplibre, MaplibreLayer } from './maplibre-layer';

type Props = {
  // MapLibre style JSON with sources, glyphs and sprites
  style: string;
  // Raster tiles for browsers without WebGL 2, which MapLibre needs, or when MapLibre can't load
  fallbackUrl: string;
  attribution: string;
};

// Copied there by scripts/copy-maplibre.mjs. Loaded natively rather than bundled, so the module and its web
// worker share one download of MapLibre's common code
const MAPLIBRE_URL = `/vendor/maplibre-gl@${process.env.MAPLIBRE_VERSION}/maplibre-gl.mjs`;

let maplibre: Promise<Maplibre> | undefined;

const loadMaplibre = (): Promise<Maplibre> => {
  maplibre ??= import(/* webpackIgnore: true */ MAPLIBRE_URL) as Promise<Maplibre>;

  return maplibre;
};

const supportsWebGL2 = (): boolean => {
  try {
    return document.createElement('canvas').getContext('webgl2') !== null;
  } catch {
    return false;
  }
};

// swisstopo's vector base map underneath Leaflet's markers and controls
export const VectorTileLayer: FC<Props> = ({ style, fallbackUrl, attribution }) => {
  const map = useMap();
  // The map only renders in the browser (ssr: false), so the check can run during the first render
  const [useRasterTiles, setUseRasterTiles] = useState(() => !supportsWebGL2());

  useEffect(() => {
    if (useRasterTiles) {
      return;
    }

    let layer: MaplibreLayer | undefined;
    let cancelled = false;

    void loadMaplibre()
      .then((module) => {
        if (!cancelled) {
          layer = new MaplibreLayer(module, style, attribution);
          layer.addTo(map);
        }
      })
      .catch((error: unknown) => {
        console.error('Vector tiles unavailable, falling back to raster tiles', error);

        if (!cancelled) {
          setUseRasterTiles(true);
        }
      });

    return () => {
      cancelled = true;
      layer?.remove();
    };
  }, [map, style, attribution, useRasterTiles]);

  return useRasterTiles ? <TileLayer url={fallbackUrl} attribution={attribution} className="raster-fallback" /> : null;
};
