import { DivIcon } from 'leaflet';
import { type FC, useMemo } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker } from 'react-leaflet';
import type { Webcam } from '@/services/webcamData';

type Props = {
  webcam: Webcam;
  refreshQuery: string;
  onSelected: (webcam: Webcam) => void;
};

const CamIcon: FC<Omit<Props, 'onSelected'>> = ({ webcam, refreshQuery }) => {
  return (
    <div
      className="bg-slate h-full w-full cursor-pointer overflow-hidden rounded-xl border border-white bg-cover bg-center bg-no-repeat shadow-md select-none"
      style={{ backgroundImage: `url(${webcam.thumbnail}?${refreshQuery})` }}
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
      eventHandlers={{
        click: () => onSelected(webcam),
      }}
      riseOnHover
    />
  );
};
