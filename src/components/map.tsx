import { Point } from "ol/geom";
import "ol/ol.css";
import { fromLonLat } from "ol/proj.js";
import React from "react";
import {
  RFeature,
  RLayerTile,
  RLayerVector,
  RMap,
  ROverlay,
  RStyle,
} from "rlayers";

export default function SunpeakMap({ webcamData }): JSX.Element {
  const map = React.createRef() as React.RefObject<RMap>;
  const [size, setSize] = React.useState(96);

  const calculateSize = () => {
    const zoom = map.current?.ol.getView().getZoom();
    if (zoom) {
      if (zoom < 9) {
        setSize(48);
      } else if (zoom < 10) {
        setSize(56);
      } else if (zoom < 11) {
        setSize(96);
      } else if (zoom < 12) {
        setSize(128);
      } else if (zoom < 13) {
        setSize(148);
      } else {
        setSize(196);
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
      <RLayerTile url="https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg" />
      <RLayerVector zIndex={10}>
        <RStyle.RStyle>
          <RStyle.RIcon src="./arrow.svg" anchor={[0.5, 0.1]} />
        </RStyle.RStyle>
        {webcamData.map((cam) => (
          <RFeature
            key={cam[0]}
            geometry={new Point(fromLonLat([cam[2], cam[1]]))}
          >
            <ROverlay>
              <a
                href={cam[4] ?? cam[3]}
                target="_blank"
                rel="noopener noreferrer"
                className={`block border-2 border-white rounded-md animate-move-background shadow`}
                style={{
                  transform: `translate(-${size / 2}px, -${size}px)`,
                  background: `url(${cam[3]})`,
                  backgroundSize: "cover",
                  width: `${size}px`,
                  height: `${size}px`,
                }}
              ></a>
            </ROverlay>
          </RFeature>
        ))}
      </RLayerVector>
    </RMap>
  );
}
