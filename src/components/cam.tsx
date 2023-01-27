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
        <motion.div
          layoutId={webcam.name}
          onClick={togglePeek}
          className={`border-[3px] border-white rounded-xl shadow-md ${
            webcam.panorama ? "animate-move-background" : ""
          }`}
          style={{
            background: `url(${webcam.url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: `${size}px`,
            height: `${size}px`,
            marginTop: "4px",
            marginLeft: `-${size / 2}px`,
          }}
        ></motion.div>
      </ROverlay>
    </RFeature>
  );
}
