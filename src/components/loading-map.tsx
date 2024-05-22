import 'leaflet/dist/leaflet.css';
import { FC } from 'react';
import { LoadingIcon } from './icons/loading';

export const LoadingMap: FC = () => (
  <div className="h-full w-full">
    <div className="absolute inset-0 flex items-center justify-center">
      <LoadingIcon size={128} />
    </div>
  </div>
);
