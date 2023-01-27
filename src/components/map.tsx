import { defaults as defaultControls, ScaleLine } from "ol/control";
import TileLayer from "ol/layer/Tile";
import Map from "ol/Map";
import XYZ from "ol/source/XYZ";
import View from "ol/View";
import { useEffect, useRef, useState } from "react";
import { fromLonLat } from "ol/proj.js";

export const SunpeakMap = function () {
  const [map, setMap] = useState<Map>(undefined);
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map>();
  mapRef.current = map;

  const chur = [9.533333, 46.85];
  const churWebMercator = fromLonLat(chur);

  useEffect(() => {
    const initialMap = new Map({
      target: mapElement.current,
      controls: defaultControls().extend([
        new ScaleLine({
          units: "metric",
        }),
      ]),
      layers: [
        new TileLayer({
          source: new XYZ({
            url: `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg`,
          }),
        }),
      ],
      view: new View({
        center: churWebMercator,
        zoom: 11,
        minZoom: 9,
        maxZoom: 13,
        enableRotation: false,
      }),
    });
    setMap(initialMap);
  }, []);

  return (
    <div
      id="map"
      ref={mapElement}
      style={{ height: "100%", width: "100%" }}
    ></div>
  );
};

export default SunpeakMap;
