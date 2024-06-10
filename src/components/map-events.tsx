import { FC } from 'react';
import { useMapEvents } from 'react-leaflet';
import { saveCenterToCookie, saveLayerToCookie } from '../services/cookie-actions';

type Props = {
  onZoomChange?: (zoom: number) => void;
};

export const MapEvents: FC<Props> = ({ onZoomChange }) => {
  const map = useMapEvents({
    // When moving the map, save the new center to a cookie
    moveend: () => {
      const center = map.getCenter();
      saveCenterToCookie(center.lat.toString(), center.lng.toString(), map.getZoom().toString());
    },

    zoomend: () => {
      onZoomChange && onZoomChange(map.getZoom());
    },

    // When layers are switched, save the settings to a cookie
    overlayadd: (event) => {
      saveLayerToCookie(event.name, true);
    },

    overlayremove: (event) => {
      saveLayerToCookie(event.name, false);
    },
  });

  return null;
};
