import { Control as LeafletControl, type LocationEvent } from 'leaflet';
import { type FC, useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { MAX_ZOOM } from '@/config';

type Props = {
  onLocationFound: (location: [number, number]) => void;
};

export const LocationControl: FC<Props> = ({ onLocationFound }) => {
  const map = useMap();
  const controlRef = useRef<LeafletControl | null>(null);

  useEffect(() => {
    if (!controlRef.current) {
      const control = new LeafletControl({ position: 'bottomright' });

      control.onAdd = () => {
        const div = document.createElement('div');
        div.className = 'leaflet-control';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'bg-white p-2 rounded shadow hover:opacity-80';
        button.title = 'Show my location';
        button.setAttribute('aria-label', 'Show my location');
        button.innerHTML = `
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        `;

        button.onclick = () => {
          map.locate({ setView: true, maxZoom: MAX_ZOOM });
        };

        div.appendChild(button);

        return div;
      };

      controlRef.current = control;
      control.addTo(map);
    }

    const handleLocationFound = (e: LocationEvent) => {
      onLocationFound([e.latlng.lat, e.latlng.lng]);
    };

    const handleLocationError = () => {
      console.error('Unable to determine your location');
    };

    map.on('locationfound', handleLocationFound);
    map.on('locationerror', handleLocationError);

    return () => {
      map.off('locationfound', handleLocationFound);
      map.off('locationerror', handleLocationError);
      if (controlRef.current) {
        controlRef.current.remove();
        controlRef.current = null;
      }
    };
  }, [map, onLocationFound]);

  return null;
};
