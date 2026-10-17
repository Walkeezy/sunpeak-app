import { fill } from '@/i18n/format';
import type { Messages } from '@/messages/types';

// "less than 1 km" or "12 km"
export const formatDistance = (
  { distanceUnderOneKm, distanceKm }: Pick<Messages['webcam'], 'distanceUnderOneKm' | 'distanceKm'>,
  km: number,
): string => (km < 1 ? distanceUnderOneKm : fill(distanceKm, { km: Math.round(km) }));
