'use client';

import 'leaflet/dist/leaflet.css';
import { FC, useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { INITIAL_CENTER, INITIAL_ZOOM, MAX_BOUNDS, MAX_ZOOM, MIN_ZOOM } from '../config';
import { TemperatureData } from '../services/weatherData';
import { Webcam, WebcamData } from '../services/webcamData';
import { SaveCenter } from './save-center';
import { Temperature } from './temperature';

type Props = {
  mapboxUrl: string;
  webcamData: WebcamData;
  temperatureData: TemperatureData;
  activeWebcam?: Webcam;
  center?: { centerLat: string; centerLon: string; zoom: string };
};

export const Map: FC<Props> = ({ mapboxUrl, temperatureData, center }) => {
  // const mapRef = createRef<RMap>();
  // const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
  // const [designTokens, setDesignTokens] = useState<DesignTokens>(DefaultDesignTokens);
  // const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  // const [location, setLocation] = useState<[number, number]>();

  // const updateZoom = () => {
  //   const currentZoom = mapRef.current?.ol.getView().getZoom();
  //   if (currentZoom && currentZoom !== zoom) {
  //     setZoom(currentZoom);
  //   }
  // };

  // useEffect(() => {
  //   if (zoom) {
  //     setDesignTokens(getDesignTokensByZoom(zoom));
  //   }
  // }, [zoom]);

  // const locateUser = () => {
  //   setLoadingLocation(true);
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       setLoadingLocation(false);
  //       setLocation([position.coords.longitude, position.coords.latitude]);
  //     },
  //     (error) => {
  //       setLoadingLocation(false);
  //       console.error(error.message);
  //     },
  //     { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
  //   );
  // };

  // useEffect(() => {
  //   if (location) {
  //     mapRef.current?.ol.getView().animate({
  //       center: fromLonLat(location),
  //       zoom: 12,
  //       duration: 500,
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [location]);

  // const allWebcams = useMemo(
  //   () =>
  //     webcamData.map((webcam) => (
  //       <Cam
  //         key={`${webcam.name}-${webcam.city}`}
  //         webcam={webcam}
  //         isActive={webcam === activeWebcam}
  //         refreshQuery={refreshQuery}
  //         designTokens={designTokens}
  //         togglePeek={() => togglePeek(webcam)}
  //       />
  //     )),
  //   [webcamData, activeWebcam, refreshQuery, designTokens, togglePeek],
  // );

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
      <SaveCenter />

      {allTemperatures.map((temperature) => temperature)}
    </MapContainer>
  );
};
