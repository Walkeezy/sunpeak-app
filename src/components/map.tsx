import { Point } from "ol/geom";
import "ol/ol.css";
import { fromLonLat } from "ol/proj.js";
import {
  RFeature,
  RLayerTile,
  RLayerVector,
  RMap,
  ROSM,
  ROverlay,
} from "rlayers";
import cams from "../data/cams.json";

export default function SunpeakMap(): JSX.Element {
  console.log({ cams });

  return (
    <RMap
      className="h-full w-full"
      initial={{
        center: fromLonLat([9.533333, 46.85]),
        zoom: 10,
      }}
      enableRotation={false}
      minZoom={8}
      maxZoom={13}
    >
      <RLayerTile url="https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg" />
      <RLayerVector zIndex={10}>
        {cams.map((cam) => (
          <RFeature
            key={cam.id}
            geometry={
              new Point(fromLonLat([cam.location.lng, cam.location.lat]))
            }
          >
            <ROverlay className="bg-white p-1 rounded">
              <img src={cam.url} width="120" alt={cam.name}></img>
            </ROverlay>
          </RFeature>
        ))}
      </RLayerVector>
    </RMap>
  );
}

// Brambrüesch url: https://backend.roundshot.com/cams/587/thumbnail
// Chur url: https://backend.roundshot.com/cams/151/thumbnail
