import { fill } from '@/i18n/format';
import type { Messages } from '@/messages/types';
import type { Temperature } from '@/services/temperatureData';
import { formatDistance } from './formatDistance';
import type { NearestMeasurement } from './nearestMeasurement';
import { formatMeasurementTime } from './temperatureLabel';

// "Säntis, less than 1 km away: 4.2 °C at 10:10"
export const nearestStationText = (
  t: Messages['webcam'],
  { measurement, distanceKm }: NearestMeasurement<Temperature>,
): string => {
  const time = formatMeasurementTime(measurement.measuredAt);

  return fill(time ? t.stationWithTime : t.station, {
    name: measurement.stationName ?? t.stationFallback,
    distance: formatDistance(t, distanceKm),
    value: measurement.value,
    time: time ?? '',
  });
};
