import { Point } from "ol/geom";
import "ol/ol.css";
import { fromLonLat } from "ol/proj.js";
import React from "react";
import {
  RControl,
  RFeature,
  RLayerTile,
  RLayerVector,
  RMap,
  ROverlay,
  RStyle,
} from "rlayers";
import { WebcamData } from "../services/sheet";

type Props = {
  webcamData: WebcamData;
};

export default function SunpeakMap({ webcamData }: Props): JSX.Element {
  const map = React.createRef() as React.RefObject<RMap>;
  const [size, setSize] = React.useState(84);

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
        setSize(72);
      } else if (zoom > 12) {
        setSize(96);
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
        <RStyle.RStyle>
          <RStyle.RIcon src="./arrow.svg" />
        </RStyle.RStyle>
        {webcamData.map((cam) => (
          <RFeature
            key={cam.name}
            geometry={new Point(fromLonLat([cam.longitude, cam.latitude]))}
          >
            <ROverlay>
              <a
                href={cam.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`block border-2 border-white rounded-md shadow ${
                  cam.panorama ? "animate-move-background" : ""
                }`}
                style={{
                  background: `url(${cam.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: `${size}px`,
                  height: `${size}px`,
                  marginTop: "4px",
                  marginLeft: `-${size / 2}px`,
                }}
              ></a>
            </ROverlay>
          </RFeature>
        ))}
      </RLayerVector>
    </RMap>
  );
}
