import type { Temperature } from '@/services/temperatureData';

const timeFormat = new Intl.DateTimeFormat('de-CH', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich' });

export const temperatureLabel = ({ value, stationName, measuredAt }: Temperature): string => {
  const time = measuredAt ? new Date(measuredAt) : undefined;
  const timeSuffix = time && !Number.isNaN(time.getTime()) ? ` (${timeFormat.format(time)})` : '';

  return `${stationName ? `${stationName}: ` : ''}${value} °C${timeSuffix}`;
};
