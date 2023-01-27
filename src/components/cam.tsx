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
  return (
    <RFeature
      geometry={new Point(fromLonLat([webcam.longitude, webcam.latitude]))}
    >
      <ROverlay>
        <div className="relative">
          <motion.div
            layoutId={webcam.name}
            onClick={togglePeek}
            className={`relative cursor-pointer border-[3px] border-white bg-white rounded-xl shadow-md z-10 ${
              webcam.panorama ? "animate-move-background" : ""
            }`}
            style={{
              background: `url(${webcam.thumbnail})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              width: `${size}px`,
              height: `${size}px`,
              marginTop: "4px",
              marginLeft: `-${size / 2}px`,
            }}
          />
          <div className="absolute -top-1 -left-2 w-4 h-4 rotate-45 bg-white z-0"></div>
        </div>
      </ROverlay>
    </RFeature>
  );
}
