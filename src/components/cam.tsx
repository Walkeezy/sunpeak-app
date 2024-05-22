import { DivIcon } from 'leaflet';
import { FC } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker } from 'react-leaflet';
import { Webcam } from '../services/webcamData';

type Props = {
  webcam: Webcam;
  size: number;
  refreshQuery: string;
  onSelected: (webcam: Webcam) => void;
};

const CamIcon: FC<Omit<Props, 'size' | 'onSelected'>> = ({ webcam, refreshQuery }) => {
  return (
    <div
      className="user-select-none h-full w-full cursor-pointer overflow-hidden rounded-xl border border-white bg-slate-700 bg-cover bg-center bg-no-repeat shadow-md"
      style={{ backgroundImage: `url(${webcam.thumbnail}?${refreshQuery})` }}
    />
  );
};

export const Cam: FC<Props> = ({ webcam, size, refreshQuery, onSelected }) => {
  const icon = new DivIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: renderToString(<CamIcon webcam={webcam} refreshQuery={refreshQuery} />),
  });

  return (
    <Marker
      position={[webcam.latitude, webcam.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onSelected && onSelected(webcam),
      }}
    />
  );
};
