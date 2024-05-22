'use client';

import { LayerGroup as LayerGroupType } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { LayerGroup, LayersControl, MapContainer, TileLayer } from 'react-leaflet';
import { INITIAL_CENTER, INITIAL_ZOOM, MAX_BOUNDS, MAX_ZOOM, MIN_ZOOM } from '../config';
import { TemperatureData } from '../services/weatherData';
import { Webcam, WebcamData } from '../services/webcamData';
import { generateRefreshQuery } from '../utils/generateRefreshQuery';
import { Cam } from './cam';
import { CamOverlay } from './cam-overlay';
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
  const [camSize, setCamSize] = useState(36);
  const [activeCam, setActiveCam] = useState<Webcam | undefined>(undefined);
  const [refreshQuery, setRefreshQuery] = useState<string>(generateRefreshQuery());

  const handleCamSizing = (zoom: number) => {
    if (zoom <= 10) {
      setCamSize(36);
    } else if (zoom <= 11) {
      setCamSize(42);
    } else if (zoom <= 12) {
      setCamSize(56);
    } else if (zoom <= 13) {
      setCamSize(64);
    } else {
      setCamSize(72);
    }
  };

  useEffect(() => {
    center && handleCamSizing(parseInt(center.zoom));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const allWebcams = useMemo(
    () =>
      webcamData.map((webcam) => (
        <Cam
          key={`${webcam.name}-${webcam.city}`}
          webcam={webcam}
          size={camSize}
          refreshQuery={refreshQuery}
          onSelected={(cam) => setActiveCam(cam)}
        />
      )),
    [webcamData, camSize, refreshQuery],
  );

  const allTemperatures = useMemo(
    () => temperatureData.map((temperature) => <Temperature key={temperature.id} temperature={temperature} />),
    [temperatureData],
  );

  return (
    <div className="h-full w-full">
      {activeCam && <CamOverlay webcam={activeCam} onClose={() => setActiveCam(undefined)} />}
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
        <MapEvents tempLayerRef={tempLayerRef} onZoomChange={(zoom) => handleCamSizing(zoom)} />
      </MapContainer>
    </div>
  );
};
