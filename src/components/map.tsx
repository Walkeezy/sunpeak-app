'use client';

import { Icon, type LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { AttributionControl, LayerGroup, MapContainer, Marker, TileLayer } from 'react-leaflet';
import { INITIAL_CENTER, INITIAL_ZOOM, MAX_BOUNDS, MAX_ZOOM, MIN_ZOOM } from '@/config';
import type { TemperatureData } from '@/services/temperatureData';
import type { Webcam, WebcamData } from '@/services/webcamData';
import type { WindData } from '@/services/windData';
import type { MapCenter } from '@/utils/parseMapCenter';
import { saveLayerToCookie } from '@/utils/preferenceCookie';
import { CAM_SEARCH_PARAM, mapWithWebcamPath } from '@/utils/webcamUrls';
import { Cam } from './cam';
import { CamOverlay } from './cam-overlay';
import { type LayerName, LayerToggles, type LayerVisibility } from './layer-toggles';
import { LocationControl } from './location-control';
import { MapEvents } from './map-events';
import { Temperature } from './temperature';
import { Wind } from './wind';

type Props = {
  mapboxUrl: string;
  webcamData: WebcamData;
  temperatureData: TemperatureData;
  windData: WindData;
  refreshQuery: string;
  center?: MapCenter;
  // Opened on mount, with the map centred on it; set when the page was requested as /?cam=…
  initialCam?: Webcam;
  isWindVisible: boolean;
  isTemperatureVisible: boolean;
  isWebcamsVisible: boolean;
  onLocationError: () => void;
};

// Marks history entries this component pushed, so closing can go back instead of piling up entries
const CAM_HISTORY_KEY = 'sunpeakCam';

const camSlugFromUrl = () => new URLSearchParams(window.location.search).get(CAM_SEARCH_PARAM);

const locationIcon = new Icon({
  iconUrl: '/current-userlocation.svg',
  className: 'user-location-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const WebcamMapComponent: FC<Props> = ({
  mapboxUrl,
  webcamData,
  temperatureData,
  windData,
  center,
  initialCam,
  refreshQuery,
  isWindVisible,
  isTemperatureVisible,
  isWebcamsVisible,
  onLocationError,
}) => {
  const [activeCam, setActiveCam] = useState<Webcam | undefined>(initialCam);
  const [location, setLocation] = useState<[number, number] | undefined>(undefined);
  const [visibility, setVisibility] = useState<LayerVisibility>({
    Webcams: isWebcamsVisible,
    Temperature: isTemperatureVisible,
    Wind: isWindVisible,
  });

  const toggleLayer = (layer: LayerName) => {
    const isOn = !visibility[layer];
    saveLayerToCookie(layer, isOn);
    setVisibility((prev) => ({ ...prev, [layer]: isOn }));
  };

  // The open webcam is mirrored in the URL (/?cam=…) so the view can be shared and the back button closes it.
  // Native pushState keeps this on the client; a router navigation would re-render the page on the server
  const openCam = useCallback((webcam: Webcam) => {
    setActiveCam(webcam);
    window.history.pushState({ [CAM_HISTORY_KEY]: true }, '', mapWithWebcamPath(webcam.slug));
  }, []);

  // Stable, so the overlay's window listener isn't re-registered on every map render
  const closeCam = useCallback(() => {
    setActiveCam(undefined);

    if (window.history.state?.[CAM_HISTORY_KEY]) {
      // Our own entry: leave it so the back button isn't needed twice. The popstate handler sees no slug
      window.history.back();
    } else {
      // Opened from a shared link or a webcam page: just clean the URL
      window.history.replaceState(null, '', '/');
    }
  }, []);

  // Browser back and forward move between the plain map and an open webcam
  useEffect(() => {
    const syncWithUrl = () => {
      const slug = camSlugFromUrl();
      setActiveCam(slug ? webcamData.find((webcam) => webcam.slug === slug) : undefined);
    };

    window.addEventListener('popstate', syncWithUrl);

    return () => window.removeEventListener('popstate', syncWithUrl);
  }, [webcamData]);

  const allWebcams = useMemo(
    () =>
      webcamData.map((webcam) => <Cam key={webcam.slug} webcam={webcam} refreshQuery={refreshQuery} onSelected={openCam} />),
    [webcamData, refreshQuery, openCam],
  );

  const allTemperatures = useMemo(
    () => temperatureData.map((temperature) => <Temperature key={temperature.id} temperature={temperature} />),
    [temperatureData],
  );

  const allWinds = useMemo(() => windData.map((wind) => <Wind key={wind.id} wind={wind} />), [windData]);

  // A webcam from the URL wins over the remembered view, so a shared link always shows its webcam
  const initialCenter: LatLngTuple = initialCam
    ? [initialCam.latitude, initialCam.longitude]
    : center
      ? [parseFloat(center.centerLat), parseFloat(center.centerLon)]
      : INITIAL_CENTER;
  const initialZoom = initialCam ? MAX_ZOOM : center ? parseInt(center.zoom, 10) : INITIAL_ZOOM;

  return (
    <div className="relative h-full w-full">
      {activeCam && <CamOverlay key={activeCam.slug} webcam={activeCam} refreshQuery={refreshQuery} onClose={closeCam} />}
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        maxBounds={MAX_BOUNDS}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        {/* Top right, opposite the zoom control, so the legend and locate button keep the bottom corners */}
        <AttributionControl position="topright" prefix={false} />
        <TileLayer attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>' url={mapboxUrl} />
        {visibility.Temperature && <LayerGroup>{allTemperatures}</LayerGroup>}
        {visibility.Wind && <LayerGroup>{allWinds}</LayerGroup>}
        {visibility.Webcams && <LayerGroup>{allWebcams}</LayerGroup>}
        <MapEvents />
        <LocationControl onLocationFound={setLocation} onLocationError={onLocationError} />
        {location && <Marker position={location} icon={locationIcon} />}
      </MapContainer>
      <LayerToggles visibility={visibility} onToggle={toggleLayer} />
    </div>
  );
};

// Every prop is stable between the app's own state changes (banner, refresh), so skip those renders
export const WebcamMap = memo(WebcamMapComponent);
