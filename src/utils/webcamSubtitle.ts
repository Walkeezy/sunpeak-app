import type { Locale } from '@/i18n/config';
import { fill } from '@/i18n/format';
import type { Webcam } from '@/services/webcamData';
import { formatAltitude } from './formatAltitude';

// "Schwägalp · 1’352 m ü. M.": the place and the altitude, whichever are known
export const webcamSubtitle = (
  { city, altitude }: Pick<Webcam, 'city' | 'altitude'>,
  altitudeTemplate: string,
  locale: Locale,
): string =>
  [city, altitude === undefined ? '' : fill(altitudeTemplate, { altitude: formatAltitude(altitude, locale) })]
    .filter(Boolean)
    .join(' · ');
