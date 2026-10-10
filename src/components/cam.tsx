import { DivIcon } from 'leaflet';
import { type FC, useMemo } from 'react';
import { Marker } from 'react-leaflet';
import type { Webcam } from '@/services/webcamData';
import { escapeHtml } from '@/utils/escapeHtml';
import { withRefreshQuery } from '@/utils/generateRefreshQuery';

type Props = {
  webcam: Webcam;
  refreshQuery: string;
  onSelected: (webcam: Webcam) => void;
};

// Plain markup rather than renderToString, which would ship React's server renderer to the browser.
// The fallback icon underneath shows when the thumbnail can't be loaded
const camIconHtml = (thumbnail: string, refreshQuery: string) =>
  `<div class="bg-schiefer border-firn h-full w-full cursor-pointer overflow-hidden border bg-cover bg-center bg-no-repeat shadow-md select-none" style="background-image:url(${escapeHtml(withRefreshQuery(thumbnail, refreshQuery))}),url(/webcam-fallback.svg);background-size:cover,50%"></div>`;

export const Cam: FC<Props> = ({ webcam, refreshQuery, onSelected }) => {
  const icon = useMemo(
    () =>
      new DivIcon({
        className: 'webcam-icon',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        html: camIconHtml(webcam.thumbnail, refreshQuery),
      }),
    [webcam.thumbnail, refreshQuery],
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
