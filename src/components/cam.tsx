import { motion } from "framer-motion";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj.js";
import { useState } from "react";
import { RFeature, ROverlay } from "rlayers";
import { Webcam } from "../services/sheet";
import { DesignTokens } from "../utils/getDesignTokensByZoom";
import { joinClassNames } from "../utils/joinClassnames";
import LoadingIcon from "./icons/loading";

type Props = {
  webcam: Webcam;
  refreshQuery: string;
  designTokens: DesignTokens;
  togglePeek: () => void;
};

export default function Cam({
  webcam,
  refreshQuery,
  designTokens,
  togglePeek,
}: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const { camSize, borderRadius, arrowSize } = designTokens;
  return (
    <RFeature
      geometry={new Point(fromLonLat([webcam.longitude, webcam.latitude]))}
    >
      <ROverlay>
        <div className="relative">
          <motion.div
            layoutId={`${webcam.name}-${webcam.city}`}
            initial={false}
            onClick={togglePeek}
            className={joinClassNames([
              "relative z-10 cursor-pointer border-2 border-white bg-slate-700 shadow-md mt-1 overflow-hidden",
              borderRadius,
            ])}
            style={{
              width: `${camSize}px`,
              height: `${camSize}px`,
              marginLeft: `-${camSize / 2}px`,
            }}
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingIcon />
              </div>
            )}
            <img
              src={webcam.thumbnail + "?" + refreshQuery}
              width={camSize}
              height={camSize}
              className={joinClassNames([
                "object-cover w-full h-full",
                loading && "opacity-0",
              ])}
              loading="lazy"
              onLoad={() => setLoading(false)}
              alt={webcam.name}
            />
          </motion.div>
          <div
            className="absolute rotate-45 bg-white z-0"
            style={{
              top: `-${arrowSize / 2}px`,
              left: `-${arrowSize / 2}px`,
              width: `${arrowSize}px`,
              height: `${arrowSize}px`,
            }}
          ></div>
        </div>
      </ROverlay>
    </RFeature>
  );
}
