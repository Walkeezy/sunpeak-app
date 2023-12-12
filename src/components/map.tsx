import { boundingExtent } from 'ol/extent';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj.js';
import { RefObject, createRef, useEffect, useMemo, useState } from 'react';
import { RControl, RFeature, RLayerTile, RLayerVector, RMap, RStyle } from 'rlayers';
import { TemperatureData } from 'src/services/weatherData';
import { INITIAL_CENTER, INITIAL_ZOOM, MAX_ZOOM, MIN_ZOOM } from '../config';
import { Webcam, WebcamData } from '../services/webcamData';
import { DefaultDesignTokens, DesignTokens, getDesignTokensByZoom } from '../utils/getDesignTokensByZoom';
import Cam from './cam';
import ArrowIcon from './icons/arrow';
import LoadingIcon from './icons/loading';
import Temperature from './temperature';

type Props = {
  webcamData: WebcamData;
  temperatureData: TemperatureData;
  refreshQuery: string;
  activeWebcam?: Webcam;
  togglePeek: (cam: Webcam) => void;
};

export default function Map({ webcamData, temperatureData, refreshQuery, activeWebcam, togglePeek }: Props): JSX.Element {
  const mapRef = createRef() as RefObject<RMap>;
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
  const [designTokens, setDesignTokens] = useState<DesignTokens>(DefaultDesignTokens);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [location, setLocation] = useState<[number, number]>();

  const updateZoom = () => {
    const currentZoom = mapRef.current?.ol.getView().getZoom();
    if (currentZoom && currentZoom !== zoom) {
      setZoom(currentZoom);
    }
  };

  useEffect(() => {
    if (zoom) {
      setDesignTokens(getDesignTokensByZoom(zoom));
    }
  }, [zoom]);

  const locateUser = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoadingLocation(false);
        setLocation([position.coords.longitude, position.coords.latitude]);
      },
      (error) => {
        setLoadingLocation(false);
        console.error(error.message);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
    );
  };

  useEffect(() => {
    if (location) {
      mapRef.current?.ol.getView().animate({
        center: fromLonLat(location),
        zoom: 12,
        duration: 500,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const allWebcams = useMemo(
    () =>
      webcamData.map((webcam) => (
        <Cam
          key={`${webcam.name}-${webcam.city}`}
          webcam={webcam}
          isActive={webcam === activeWebcam}
          refreshQuery={refreshQuery}
          designTokens={designTokens}
          togglePeek={() => togglePeek(webcam)}
        />
      )),
    [webcamData, activeWebcam, refreshQuery, designTokens, togglePeek],
  );

  const allTemperatures = useMemo(
    () => temperatureData.map((temperature) => <Temperature key={temperature.id} temperature={temperature} />),

    [temperatureData],
  );

  return (
    <RMap
      ref={mapRef}
      className="h-full w-full"
      initial={{
        center: fromLonLat(INITIAL_CENTER),
        zoom: INITIAL_ZOOM,
      }}
      extent={boundingExtent([fromLonLat([5.7, 45.6]), fromLonLat([10.8, 48])])}
      enableRotation={false}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      onRenderComplete={updateZoom}
    >
      <RControl.RScaleLine />
      <RControl.RCustom className="absolute right-[0.5em] top-[0.5em]">
        <button title="Locate me" onClick={locateUser}>
          <div className="flex justify-center">{loadingLocation ? <LoadingIcon color="#666" /> : <ArrowIcon />}</div>
        </button>
      </RControl.RCustom>
      <RLayerTile url="https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg" />
      <RLayerVector zIndex={10}>
        <RStyle.RStyle></RStyle.RStyle>
        {allWebcams}
      </RLayerVector>
      {zoom > 9 && (
        <RLayerVector zIndex={5}>
          <RStyle.RStyle></RStyle.RStyle>
          {allTemperatures}
        </RLayerVector>
      )}
      {location && (
        <RLayerVector zIndex={10}>
          <RFeature geometry={new Point(fromLonLat(location))}>
            <RStyle.RStyle>
              <RStyle.RIcon src={'./current-userlocation.svg'} />
            </RStyle.RStyle>
          </RFeature>
        </RLayerVector>
      )}
    </RMap>
  );
}
