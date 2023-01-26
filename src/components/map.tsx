import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";
import XYZ from "ol/source/XYZ";
import View from "ol/View";
import { useRef } from "react";

export const SunpeakMap = function () {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>();

  if (mapElement.current && !mapRef.current) {
    mapRef.current = new Map({
      target: mapElement.current ?? undefined,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg`,
          }),
        }),
      ],
      view: new View({
        projection: "EPSG:3857",
        center: [46.84986, 9.53287],
        zoom: 2,
      }),
    });
  }

  return (
    <>
      <h1>Sunpeak Map:</h1>
      <div
        id="map"
        ref={mapElement}
        style={{ height: "100%", width: "100%" }}
        className="border border-red-500"
      ></div>
    </>
  );
};

export default SunpeakMap;
