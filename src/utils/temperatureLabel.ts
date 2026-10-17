import type { Temperature } from '@/services/temperatureData';

const timeFormat = new Intl.DateTimeFormat('de-CH', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich' });

// Swiss local time of a measurement, e.g. "09:30"; undefined when the timestamp is missing or unparsable
export const formatMeasurementTime = (measuredAt?: string): string | undefined => {
  const time = measuredAt ? new Date(measuredAt) : undefined;

  return time && !Number.isNaN(time.getTime()) ? timeFormat.format(time) : undefined;
};

export const temperatureLabel = ({ value, stationName, measuredAt }: Temperature): string => {
  const time = formatMeasurementTime(measuredAt);
  const timeSuffix = time ? ` (${time})` : '';

  return `${stationName ? `${stationName}: ` : ''}${value} °C${timeSuffix}`;
};
