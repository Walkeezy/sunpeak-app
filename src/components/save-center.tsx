import { FC } from 'react';
import { useMapEvents } from 'react-leaflet';
import { saveCenterToCookie } from '../app/actions';

export const SaveCenter: FC = () => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      saveCenterToCookie(center.lat.toString(), center.lng.toString(), map.getZoom().toString());
    },
  });

  return null;
};
