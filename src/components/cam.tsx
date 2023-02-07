import { motion } from "framer-motion";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj.js";
import { useState } from "react";
import { RFeature, ROverlay } from "rlayers";
import { Webcam } from "../services/sheet";
import { joinClassNames } from "../utils/joinClassnames";
import LoadingIcon from "./icons/loading";

type Props = {
  webcam: Webcam;
  refreshQuery: string;
  size: number;
  togglePeek: () => void;
};

export default function Cam({
  webcam,
  refreshQuery,
  size,
  togglePeek,
}: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  return (
    <RFeature
      geometry={new Point(fromLonLat([webcam.longitude, webcam.latitude]))}
    >
      <ROverlay>
        <div className="relative">
          <motion.div
            layoutId={webcam.name}
            onClick={togglePeek}
            className="relative z-10 cursor-pointer border-2 border-white bg-slate-700 rounded-xl shadow-md mt-1 overflow-hidden"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: `-${size / 2}px`,
            }}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingIcon />
              </div>
            )}
            <img
              src={webcam.thumbnail + "?" + refreshQuery}
              width={size}
              height={size}
              className={joinClassNames([
                "object-cover w-full h-full",
                loading && "opacity-0",
              ])}
              loading="lazy"
              onLoad={() => setLoading(false)}
              alt={webcam.name}
            />
          </motion.div>
          {size === 36 ? (
            <div className="absolute -top-0.5 -left-0.5 w-1 h-1 rotate-45 bg-white z-0"></div>
          ) : (
            <div className="absolute -top-1 -left-1 w-2 h-2 rotate-45 bg-white z-0"></div>
          )}
        </div>
      </ROverlay>
    </RFeature>
  );
}
