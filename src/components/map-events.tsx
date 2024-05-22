import { LayerGroup as LayerGroupType } from 'leaflet';
import { FC } from 'react';
import { useMapEvents } from 'react-leaflet';
import { saveCenterToCookie } from '../app/actions';

type Props = {
  tempLayerRef: React.MutableRefObject<LayerGroupType<unknown> | null>;
  onZoomChange?: (zoom: number) => void;
};

export const MapEvents: FC<Props> = ({ tempLayerRef, onZoomChange }) => {
  const map = useMapEvents({
    // When moving the map, save the new center to a cookie
    moveend: () => {
      const center = map.getCenter();
      saveCenterToCookie(center.lat.toString(), center.lng.toString(), map.getZoom().toString());
    },

    // When zooming in, show or hide the temperature layer
    zoomend: () => {
      onZoomChange && onZoomChange(map.getZoom());
      if (map.getZoom() < 10) {
        map.removeLayer(tempLayerRef.current!);
      } else {
        map.addLayer(tempLayerRef.current!);
      }
    },

    // When layers are switched, save the settings to a cookie
    overlayadd: (event) => {
      console.info('overlay add: ', event); // TODO
    },

    overlayremove: (event) => {
      console.info('overlay remove: ', event); // TODO
    },
  });

  return null;
};
