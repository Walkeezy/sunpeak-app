import { boundingExtent } from "ol/extent";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj.js";
import { createRef, RefObject, useEffect, useState } from "react";
import {
  RControl,
  RFeature,
  RLayerTile,
  RLayerVector,
  RMap,
  RStyle,
} from "rlayers";
import { Webcam, WebcamData } from "../services/sheet";
import Cam from "./cam";
import Arrow from "./icons/arrow";
import Loading from "./icons/loading";

type Props = {
  webcamData: WebcamData;
  togglePeek: (cam: Webcam) => void;
};

export default function Map({ webcamData, togglePeek }: Props): JSX.Element {
  const mapRef = createRef() as RefObject<RMap>;
  const [size, setSize] = useState<number>(48);
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [location, setLocation] = useState<[number, number]>(undefined);

  const calculateSize = () => {
    const zoom = mapRef.current?.ol.getView().getZoom();
    if (zoom) {
      if (zoom <= 9) {
        setSize(36);
      } else if (zoom <= 10) {
        setSize(48);
      } else if (zoom <= 11) {
        setSize(56);
      } else if (zoom <= 12) {
        setSize(64);
      } else if (zoom > 12) {
        setSize(72);
      }
    }
  };

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
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );
  };

  useEffect(() => {
    if (location) {
      mapRef.current?.ol.getView().animate({
        center: fromLonLat(location),
        zoom: 14,
        duration: 500,
      });
    }
  }, [location]);

  // limit extent to Switzerland
  const extent = boundingExtent([
    fromLonLat([5.7, 45.6]),
    fromLonLat([10.8, 48]),
  ]);

  return (
    <RMap
      ref={mapRef}
      className="h-full w-full"
      initial={{
        center: fromLonLat([9.533333, 46.85]),
        zoom: 10,
      }}
      extent={extent}
      enableRotation={false}
      minZoom={8}
      maxZoom={14}
      onPostRender={calculateSize}
    >
      <RControl.RScaleLine />
      <RControl.RCustom className="absolute bottom-0 right-0 m-4">
        <button title="Locate me" onClick={locateUser}>
          <div className="flex justify-center">
            {loadingLocation ? <Loading color="#666" /> : <Arrow />}
          </div>
        </button>
      </RControl.RCustom>
      <RLayerTile url="https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg" />
      <RLayerVector zIndex={10}>
        <RStyle.RStyle></RStyle.RStyle>
        {webcamData.map((webcam) => (
          <Cam
            key={webcam.name}
            webcam={webcam}
            size={size}
            togglePeek={() => togglePeek(webcam)}
          />
        ))}
      </RLayerVector>
      {location && (
        <RLayerVector zIndex={10}>
          <RFeature geometry={new Point(fromLonLat(location))}>
            <RStyle.RStyle>
              <RStyle.RIcon src={"./current-userlocation.svg"} />
            </RStyle.RStyle>
          </RFeature>
        </RLayerVector>
      )}
    </RMap>
  );
}
