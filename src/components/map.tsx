import { fromLonLat } from "ol/proj.js";
import { createRef, RefObject, useState } from "react";
import { RControl, RLayerTile, RLayerVector, RMap, RStyle } from "rlayers";
import { Webcam, WebcamData } from "../services/sheet";
import Cam from "./cam";

type Props = {
  webcamData: WebcamData;
  togglePeek: (cam: Webcam) => void;
};

export default function Map({ webcamData, togglePeek }: Props): JSX.Element {
  const map = createRef() as RefObject<RMap>;
  const [size, setSize] = useState<number>(48);

  const calculateSize = () => {
    const zoom = map.current?.ol.getView().getZoom();
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

  return (
    <RMap
      ref={map}
      className="h-full w-full"
      initial={{
        center: fromLonLat([9.533333, 46.85]),
        zoom: 10,
      }}
      enableRotation={false}
      minZoom={8}
      maxZoom={13}
      onPostRender={calculateSize}
    >
      <RControl.RScaleLine />
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
    </RMap>
  );
}
