import { fill } from '@/i18n/format';
import type { Messages } from '@/messages/types';

// "1 webcam" or "12 webcams"
export const formatWebcamCount = (
  { webcamCountOne, webcamCount }: Pick<Messages['place'], 'webcamCountOne' | 'webcamCount'>,
  count: number,
): string => (count === 1 ? webcamCountOne : fill(webcamCount, { count }));
