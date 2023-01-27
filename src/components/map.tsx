import { Point } from "ol/geom";
import "ol/ol.css";
import { fromLonLat } from "ol/proj.js";
import { RFeature, RLayerTile, RLayerVector, RMap, ROverlay } from "rlayers";

export default function SunpeakMap({ webcamData }): JSX.Element {
  console.log({ webcamData });
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
                className="block bg-white p-1 rounded-md w-32 h-32 animate-move-background"
                style={{
                  background: `url(${cam[3]})`,
                  backgroundSize: "cover",
                }}
              ></a>
            </ROverlay>
          </RFeature>
        ))}
      </RLayerVector>
    </RMap>
  );
}

// Brambrüesch url: https://backend.roundshot.com/cams/587/thumbnail
// Chur url: https://backend.roundshot.com/cams/151/thumbnail
