import { motion } from "framer-motion";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj.js";
import { RFeature, ROverlay } from "rlayers";
import { Webcam } from "../services/sheet";

type Props = {
  webcam: Webcam;
  size: number;
  togglePeek: () => void;
};

export default function Cam({ webcam, size, togglePeek }: Props): JSX.Element {
  const imgUrl = webcam.forceReload
    ? webcam.thumbnail + "?" + Date.now()
    : webcam.thumbnail;
  return (
    <RFeature
      geometry={new Point(fromLonLat([webcam.longitude, webcam.latitude]))}
    >
      <ROverlay>
        <div className="relative">
          <motion.div
            layoutId={webcam.name}
            onClick={togglePeek}
            className="relative z-10 cursor-pointer border-2 border-white bg-slate-700 rounded-xl shadow-md bg-cover bg-center"
            style={{
              backgroundImage: `url(${imgUrl})`,
              width: `${size}px`,
              height: `${size}px`,
              marginTop: "4px",
              marginLeft: `-${size / 2}px`,
            }}
          />
          <div className="absolute -top-1 -left-1 w-2 h-2 rotate-45 bg-white z-0"></div>
        </div>
      </ROverlay>
    </RFeature>
  );
}
