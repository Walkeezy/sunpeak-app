import { DivIcon } from 'leaflet';
import { FC } from 'react';
import { renderToString } from 'react-dom/server';
import { Marker } from 'react-leaflet';
import { Webcam } from '../services/webcamData';

type Props = {
  webcam: Webcam;
};

type IconProps = Props & {
  refreshQuery?: string;
};

const CamIcon: FC<IconProps> = ({ webcam, refreshQuery = 'asdf' }) => {
  return (
    <div className="user-select-none h-full w-full cursor-pointer overflow-hidden rounded-xl border-2 border-white bg-slate-700 shadow-md">
      <picture>
        <img
          src={webcam.thumbnail + '?' + refreshQuery}
          className="object-cover"
          loading="lazy"
          alt={webcam.name}
          style={{ width: '100%', height: '100%' }}
        />
      </picture>
    </div>
  );
};

export const Cam: FC<Props> = ({ webcam }) => {
  const icon = new DivIcon({
    className: '',
    iconSize: [64, 64],
    html: renderToString(<CamIcon webcam={webcam} />),
  });

  return <Marker position={[webcam.latitude, webcam.longitude]} icon={icon} />;
};
