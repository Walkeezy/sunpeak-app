import Link from 'next/link';
import type { FC } from 'react';
import { WebcamThumbnail } from './webcam-image';

// The responsive grid the cards sit in
export const webcamGridClasses = 'grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4';

type Props = {
  href: string;
  src: string;
  alt: string;
  name: string;
  // A quiet line under the name: the altitude, the town, a distance
  detail?: string;
};

// Thumbnail and name linking to a webcam's page, shared by every list of webcams
export const WebcamCard: FC<Props> = ({ href, src, alt, name, detail }) => (
  <Link href={href} className="group block rounded-lg">
    <WebcamThumbnail src={src} alt={alt} />
    <span className="signage group-hover:text-sonne mt-2 block truncate text-base leading-tight transition-colors">
      {name}
    </span>
    {detail && <span className="text-firn/70 block truncate text-sm">{detail}</span>}
  </Link>
);
