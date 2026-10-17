import { DivIcon } from 'leaflet';
import { type FC, useMemo } from 'react';
import { Marker } from 'react-leaflet';
import type { Station } from '@/services/stationData';
import { temperatureLabel } from '@/utils/temperatureLabel';

type Props = {
  station: Station;
  showTemperature: boolean;
  showSunshine: boolean;
  onSelect: (stationId: string) => void;
};

const PILL_SIZE = 32;
const RING_SIZE = 40;
const RING_RADIUS = 18.5;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

// Yellow arc for the minutes of sunshine out of ten, starting at the top, on a faint track that marks
// "measured, but no sun"
const sunshineRing = (minutes: number) => {
  const arc = (RING_CIRCUMFERENCE * minutes) / 10;
  const center = RING_SIZE / 2;

  return `<svg class="absolute inset-0 overflow-visible" viewBox="0 0 ${RING_SIZE} ${RING_SIZE}" aria-hidden="true"><circle cx="${center}" cy="${center}" r="${RING_RADIUS}" fill="none" stroke-width="3" class="stroke-schiefer/45"></circle>${minutes > 0 ? `<circle cx="${center}" cy="${center}" r="${RING_RADIUS}" fill="none" stroke-width="3" stroke-linecap="round" stroke-dasharray="${arc.toFixed(2)} ${RING_CIRCUMFERENCE.toFixed(2)}" transform="rotate(-90 ${center} ${center})" class="stroke-sonne"></circle>` : ''}</svg>`;
};

const temperaturePill = (value: number) =>
  `<div class="bg-schiefer border-firn text-firn signage absolute top-1/2 left-1/2 flex size-8 -translate-1/2 items-center justify-center rounded-full border font-sans text-[11px] shadow-md"><span class="ml-[2px]">${value}°</span></div>`;

// Without the temperature layer the ring surrounds a small sun: yellow when it shone at all
const sunDot = (minutes: number) =>
  `<div class="${minutes > 0 ? 'bg-sonne' : 'bg-nebel'} border-firn absolute top-1/2 left-1/2 size-5 -translate-1/2 rounded-full border shadow-md"></div>`;

// Plain markup rather than renderToString, which would ship React's server renderer to the browser
const stationIconHtml = (temperature: number | undefined, sunshine: number | undefined) =>
  `<div class="relative h-full w-full cursor-pointer select-none">${sunshine === undefined ? '' : sunshineRing(sunshine)}${temperature === undefined ? sunDot(sunshine ?? 0) : temperaturePill(temperature)}</div>`;

// One marker per weather station for the temperature and sunshine layers; a tap opens the station popup
export const StationMarker: FC<Props> = ({ station, showTemperature, showSunshine, onSelect }) => {
  const temperature = showTemperature ? station.temperature : undefined;
  const sunshine = showSunshine ? station.sunshine : undefined;
  const hasContent = temperature !== undefined || sunshine !== undefined;

  const icon = useMemo(() => {
    const size = sunshine === undefined ? PILL_SIZE : RING_SIZE;

    return new DivIcon({ className: '', iconSize: [size, size], html: stationIconHtml(temperature, sunshine) });
  }, [temperature, sunshine]);
  const eventHandlers = useMemo(() => ({ click: () => onSelect(station.id) }), [onSelect, station.id]);

  if (!hasContent) {
    return null;
  }

  const label =
    station.temperature === undefined
      ? (station.name ?? station.id)
      : temperatureLabel({ ...station, value: station.temperature, stationName: station.name });

  return (
    <Marker
      position={[station.latitude, station.longitude]}
      icon={icon}
      title={label}
      alt={label}
      // The station popup is a touch convenience; the values are in the title for keyboard and screen reader users
      keyboard={false}
      eventHandlers={eventHandlers}
      riseOnHover
    />
  );
};
