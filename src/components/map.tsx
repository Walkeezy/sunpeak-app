'use client';

import { LayerGroup as LayerGroupType } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FC, useMemo, useRef } from 'react';
import { LayerGroup, LayersControl, MapContainer, TileLayer } from 'react-leaflet';
import { INITIAL_CENTER, INITIAL_ZOOM, MAX_BOUNDS, MAX_ZOOM, MIN_ZOOM } from '../config';
import { TemperatureData } from '../services/weatherData';
import { Webcam, WebcamData } from '../services/webcamData';
import { Cam } from './cam';
import { MapEvents } from './map-events';
import { Temperature } from './temperature';

type Props = {
  mapboxUrl: string;
  webcamData: WebcamData;
  temperatureData: TemperatureData;
  activeWebcam?: Webcam;
  center?: { centerLat: string; centerLon: string; zoom: string };
};

export const Map: FC<Props> = ({ mapboxUrl, webcamData, temperatureData, center }) => {
  const tempLayerRef = useRef<LayerGroupType<unknown> | null>(null);

  const allWebcams = useMemo(
    () => webcamData.map((webcam) => <Cam key={`${webcam.name}-${webcam.city}`} webcam={webcam} />),
    [webcamData],
  );

  const allTemperatures = useMemo(
    () => temperatureData.map((temperature) => <Temperature key={temperature.id} temperature={temperature} />),
    [temperatureData],
  );

  return (
    <MapContainer
      center={center ? [parseFloat(center.centerLat), parseFloat(center.centerLon)] : INITIAL_CENTER}
      zoom={center ? parseInt(center.zoom) : INITIAL_ZOOM}
      maxBounds={MAX_BOUNDS}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer attribution='Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>' url={mapboxUrl} />

      <LayersControl position="topright">
        <LayersControl.Overlay checked name="Temperatur">
          <LayerGroup ref={tempLayerRef}>{allTemperatures.map((temp) => temp)}</LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Webcams">
          <LayerGroup>{allWebcams.map((cam) => cam)}</LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>

      <MapEvents tempLayerRef={tempLayerRef} />
    </MapContainer>
  );
};
