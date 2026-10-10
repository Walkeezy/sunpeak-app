import { DivIcon } from 'leaflet';
import { type FC, useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker } from 'react-leaflet';
import type { Webcam } from '@/services/webcamData';
import { withRefreshQuery } from '@/utils/generateRefreshQuery';

type Props = {
  webcam: Webcam;
  refreshQuery: string;
  onSelected: (webcam: Webcam) => void;
};

const CamIcon: FC<Omit<Props, 'onSelected'>> = ({ webcam, refreshQuery }) => {
  return (
    <div
      className="bg-schiefer border-firn h-full w-full cursor-pointer overflow-hidden border bg-cover bg-center bg-no-repeat shadow-md select-none"
      // The fallback icon underneath shows when the thumbnail can't be loaded
      style={{
        backgroundImage: `url(${withRefreshQuery(webcam.thumbnail, refreshQuery)}), url(/webcam-fallback.svg)`,
        backgroundSize: 'cover, 50%',
      }}
    />
  );
};

export const Cam: FC<Props> = ({ webcam, refreshQuery, onSelected }) => {
  const icon = useMemo(
    () =>
      new DivIcon({
        className: 'webcam-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        html: renderToString(<CamIcon webcam={webcam} refreshQuery={refreshQuery} />),
      }),
    [webcam, refreshQuery],
  );

  return (
    <Marker
      position={[webcam.latitude, webcam.longitude]}
      icon={icon}
      title={`${webcam.name}, ${webcam.city}`}
      alt={`${webcam.name}, ${webcam.city}`}
      eventHandlers={{
        click: () => onSelected(webcam),
      }}
      riseOnHover
    />
  );
};
