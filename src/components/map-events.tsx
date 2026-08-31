import type { Map as LeafletMap } from 'leaflet';
import { type FC, useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { camIconSize } from '@/config';
import { saveCenterToCookie, saveLayerToCookie } from '@/services/cookie-actions';

const setCamSizeVariable = (map: LeafletMap) => {
  map.getContainer().style.setProperty('--cam-size', `${camIconSize(map.getZoom())}px`);
};

export const MapEvents: FC = () => {
  const map = useMap();

  useMapEvents({
    // When moving the map, save the new center to a cookie
    moveend: () => {
      const center = map.getCenter();
      void saveCenterToCookie(center.lat.toString(), center.lng.toString(), map.getZoom().toString());
    },

    zoomend: () => {
      setCamSizeVariable(map);
    },

    // When layers are switched, save the settings to a cookie
    overlayadd: (event) => {
      void saveLayerToCookie(event.name, true);
    },

    overlayremove: (event) => {
      void saveLayerToCookie(event.name, false);
    },
  });

  useEffect(() => {
    setCamSizeVariable(map);
  }, [map]);

  return null;
};
