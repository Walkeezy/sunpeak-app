import type { Map as LeafletMap } from 'leaflet';
import { type FC, useLayoutEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { camIconSize } from '@/config';
import { saveCenterToCookie, saveLayerToCookie } from '@/services/cookie-actions';

const setCamSizeVariable = (map: LeafletMap) => {
  map.getContainer().style.setProperty('--cam-size', `${camIconSize(map.getZoom())}px`);
};

export const MapEvents: FC = () => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      void saveCenterToCookie(center.lat.toString(), center.lng.toString(), map.getZoom().toString());
    },

    zoomend: () => {
      setCamSizeVariable(map);
    },

    overlayadd: (event) => {
      void saveLayerToCookie(event.name, true);
    },

    overlayremove: (event) => {
      void saveLayerToCookie(event.name, false);
    },
  });

  useLayoutEffect(() => {
    setCamSizeVariable(map);
  }, [map]);

  return null;
};
