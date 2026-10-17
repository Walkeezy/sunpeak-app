'use client';

import { Icon, type LatLngTuple, type Map as LeafletMap, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AttributionControl, LayerGroup, MapContainer, Marker, Popup } from 'react-leaflet';
import {
  INITIAL_CENTER,
  INITIAL_ZOOM,
  MAP_ATTRIBUTION,
  MAP_FALLBACK_TILES_URL,
  MAP_STYLE_URL,
  MAX_BOUNDS,
  MAX_ZOOM,
  MIN_ZOOM,
} from '@/config';
import { useLocale } from '@/i18n/messages-provider';
import type { LayerName, LayerVisibility } from '@/layers';
import { mergeStations } from '@/services/stationData';
import type { SunshineData } from '@/services/sunshineData';
import type { TemperatureData } from '@/services/temperatureData';
import type { Webcam, WebcamData } from '@/services/webcamData';
import type { WindData } from '@/services/windData';
import { fogBoundary } from '@/utils/fogBoundary';
import { nearestMeasurement } from '@/utils/nearestMeasurement';
import type { MapCenter } from '@/utils/parseMapCenter';
import { CAM_SEARCH_PARAM, mapPath, mapWithWebcamPath } from '@/utils/paths';
import { groupByPlace, type Place } from '@/utils/places';
import { saveLayerToCookie, saveMinAltitudeToCookie } from '@/utils/preferenceCookie';
import { AltitudeFilter } from './altitude-filter';
import { Cam } from './cam';
import { CamOverlay } from './cam-overlay';
import { FogHint } from './fog-hint';
import { LayerToggles } from './layer-toggles';
import { LocationControl } from './location-control';
import { MapEvents } from './map-events';
import { MapSearch } from './map-search';
import { StationDetails } from './station-details';
import { StationMarker } from './station-marker';
import { VectorTileLayer } from './vector-tile-layer';
import { Wind } from './wind';

type Props = {
  webcamData: WebcamData;
  temperatureData: TemperatureData;
  windData: WindData;
  sunshineData: SunshineData;
  refreshQuery: string;
  center?: MapCenter;
  // Opened once the webcams are known, with the map centred on it; set when the page was requested as /?cam=…
  initialCamSlug?: string;
  // From the cookies, read during the server render
  layers: LayerVisibility;
  minAltitude: number;
  isSearchOpen: boolean;
  onSearchClose: () => void;
  onLocationError: () => void;
};

// Marks history entries this component pushed, so closing can go back instead of piling up entries
const CAM_HISTORY_KEY = 'sunpeakCam';

// Around a place's webcams when the map is fitted to them, so none sits under the controls
const PLACE_PADDING: [number, number] = [56, 56];

const camSlugFromUrl = () => new URLSearchParams(window.location.search).get(CAM_SEARCH_PARAM);

const locationIcon = new Icon({
  iconUrl: '/current-userlocation.svg',
  className: 'user-location-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const WebcamMapComponent: FC<Props> = ({
  webcamData,
  temperatureData,
  windData,
  sunshineData,
  center,
  initialCamSlug,
  refreshQuery,
  layers,
  minAltitude: initialMinAltitude,
  isSearchOpen,
  onSearchClose,
  onLocationError,
}) => {
  const locale = useLocale();
  // The Leaflet map, for flying to a search result; null until the container has mounted
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [activeCam, setActiveCam] = useState<Webcam | undefined>(undefined);
  const initialCamOpened = useRef(false);
  const [location, setLocation] = useState<[number, number] | undefined>(undefined);
  // By id, so an open popup shows the new values after a refresh
  const [activeStationId, setActiveStationId] = useState<string | undefined>(undefined);
  const [visibility, setVisibility] = useState(layers);
  const [minAltitude, setMinAltitude] = useState(initialMinAltitude);

  const toggleLayer = (layer: LayerName) => {
    const isOn = !visibility[layer];
    saveLayerToCookie(layer, isOn);
    setVisibility((prev) => ({ ...prev, [layer]: isOn }));
  };

  const changeMinAltitude = (altitude: number) => {
    saveMinAltitudeToCookie(altitude);
    setMinAltitude(altitude);
  };

  // Without a filter everything shows; with one, places of unknown altitude are left out too
  const isHighEnough = useCallback(
    (altitude: number | undefined) => minAltitude === 0 || (altitude !== undefined && altitude >= minAltitude),
    [minAltitude],
  );

  // The open webcam is mirrored in the URL (/?cam=…) so the view can be shared and the back button closes it.
  // Native pushState keeps this on the client; a router navigation would re-render the page on the server
  const openCam = useCallback(
    (webcam: Webcam) => {
      setActiveCam(webcam);
      window.history.pushState({ [CAM_HISTORY_KEY]: true }, '', mapWithWebcamPath(locale, webcam.slug));
    },
    [locale],
  );

  // Stable, so the overlay's window listener isn't re-registered on every map render
  const closeCam = useCallback(() => {
    setActiveCam(undefined);

    if (window.history.state?.[CAM_HISTORY_KEY]) {
      // Our own entry: leave it so the back button isn't needed twice. The popstate handler sees no slug
      window.history.back();
    } else {
      // Opened from a shared link or a webcam page: just clean the URL
      window.history.replaceState(null, '', mapPath(locale));
    }
  }, [locale]);

  // The webcam from a shared link opens as soon as the webcam list is there, with the map on it. It wins over
  // the remembered view, so a shared link always shows its webcam
  useEffect(() => {
    if (!map || !initialCamSlug || initialCamOpened.current || webcamData.length === 0) {
      return;
    }

    initialCamOpened.current = true;

    const webcam = webcamData.find((candidate) => candidate.slug === initialCamSlug);

    if (webcam) {
      map.setView([webcam.latitude, webcam.longitude], MAX_ZOOM, { animate: false });
      setActiveCam(webcam);
    }
  }, [map, initialCamSlug, webcamData]);

  // Browser back and forward move between the plain map and an open webcam
  useEffect(() => {
    const syncWithUrl = () => {
      const slug = camSlugFromUrl();
      setActiveCam(slug ? webcamData.find((webcam) => webcam.slug === slug) : undefined);
    };

    window.addEventListener('popstate', syncWithUrl);

    return () => window.removeEventListener('popstate', syncWithUrl);
  }, [webcamData]);

  // A search result: a webcam opens where it stands, a place fills the view with its webcams
  const showWebcam = useCallback(
    (webcam: Webcam) => {
      map?.setView([webcam.latitude, webcam.longitude], MAX_ZOOM);
      openCam(webcam);
    },
    [map, openCam],
  );

  const showPlace = useCallback(
    (place: Place) => {
      if (!map) {
        return;
      }

      if (place.webcams.length === 1) {
        map.setView([place.webcams[0].latitude, place.webcams[0].longitude], MAX_ZOOM);
      } else {
        const bounds = latLngBounds(place.webcams.map(({ latitude, longitude }): LatLngTuple => [latitude, longitude]));
        map.fitBounds(bounds, { padding: PLACE_PADDING, maxZoom: MAX_ZOOM });
      }
    },
    [map],
  );

  const places = useMemo(() => groupByPlace(webcamData).places, [webcamData]);

  const allWebcams = useMemo(
    () =>
      webcamData
        .filter((webcam) => isHighEnough(webcam.altitude))
        .map((webcam) => <Cam key={webcam.slug} webcam={webcam} refreshQuery={refreshQuery} onSelected={openCam} />),
    [webcamData, refreshQuery, openCam, isHighEnough],
  );

  const stations = useMemo(
    () => mergeStations(temperatureData, windData, sunshineData),
    [temperatureData, windData, sunshineData],
  );
  const activeStation = activeStationId ? stations.get(activeStationId) : undefined;
  // The temperature nearest to the open webcam, for its caption
  const activeCamNearest = useMemo(
    () => (activeCam ? nearestMeasurement(temperatureData, activeCam.latitude, activeCam.longitude) : undefined),
    [activeCam, temperatureData],
  );
  const boundary = useMemo(() => fogBoundary([...stations.values()]), [stations]);
  const closeStation = useCallback(() => setActiveStationId(undefined), []);
  // Leaflet closes the popup itself on a map click; keep the state in step
  const stationPopupEvents = useMemo(() => ({ remove: closeStation }), [closeStation]);

  const allStations = useMemo(
    () =>
      [...stations.values()]
        .filter((station) => isHighEnough(station.altitude))
        .map((station) => (
          <StationMarker
            key={station.id}
            station={station}
            showTemperature={visibility.Temperature}
            showSunshine={visibility.Sunshine}
            onSelect={setActiveStationId}
          />
        )),
    [stations, visibility.Temperature, visibility.Sunshine, isHighEnough],
  );

  const allWinds = useMemo(
    () =>
      windData
        .filter((wind) => isHighEnough(wind.altitude))
        .map((wind) => <Wind key={wind.id} wind={wind} onSelect={setActiveStationId} />),
    [windData, isHighEnough],
  );

  // The remembered view, or the default one on the first visit
  const initialCenter: LatLngTuple = center ? [parseFloat(center.centerLat), parseFloat(center.centerLon)] : INITIAL_CENTER;
  const initialZoom = center ? parseInt(center.zoom, 10) : INITIAL_ZOOM;

  return (
    <div className="relative h-full w-full">
      {activeCam && (
        <CamOverlay
          key={activeCam.slug}
          webcam={activeCam}
          nearest={activeCamNearest}
          refreshQuery={refreshQuery}
          onClose={closeCam}
        />
      )}
      <MapContainer
        ref={setMap}
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
        <VectorTileLayer style={MAP_STYLE_URL} fallbackUrl={MAP_FALLBACK_TILES_URL} attribution={MAP_ATTRIBUTION} />
        {(visibility.Temperature || visibility.Sunshine) && <LayerGroup>{allStations}</LayerGroup>}
        {visibility.Wind && <LayerGroup>{allWinds}</LayerGroup>}
        {visibility.Webcams && <LayerGroup>{allWebcams}</LayerGroup>}
        {activeStation && (
          <Popup
            key={activeStation.id}
            position={[activeStation.latitude, activeStation.longitude]}
            offset={[0, -12]}
            closeButton={false}
            className="station-popup"
            eventHandlers={stationPopupEvents}
          >
            <StationDetails station={activeStation} onClose={closeStation} />
          </Popup>
        )}
        <MapEvents />
        <LocationControl onLocationFound={setLocation} onLocationError={onLocationError} />
        {location && <Marker position={location} icon={locationIcon} />}
      </MapContainer>
      {isSearchOpen && (
        <div className="pointer-events-none absolute inset-x-3 top-3 z-[1060] flex justify-center">
          <MapSearch
            webcams={webcamData}
            places={places}
            onSelectWebcam={showWebcam}
            onSelectPlace={showPlace}
            onClose={onSearchClose}
          />
        </div>
      )}
      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+0.625rem)] left-[0.625rem] z-[1000] flex flex-col items-start gap-1.5">
        {boundary && <FogHint boundary={boundary} minAltitude={minAltitude} onChange={changeMinAltitude} />}
        <AltitudeFilter value={minAltitude} onChange={changeMinAltitude} />
        <LayerToggles visibility={visibility} onToggle={toggleLayer} />
      </div>
    </div>
  );
};

// Every prop is stable between the app's own state changes (toast, refresh), so skip those renders
export const WebcamMap = memo(WebcamMapComponent);
