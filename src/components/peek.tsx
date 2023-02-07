import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Webcam } from "../services/sheet";
import { generateRefreshQuery } from "../utils/generateRefreshQuery";
import { joinClassNames } from "../utils/joinClassnames";
import Caption from "./caption";
import LoadingIcon from "./icons/loading";

type Props = {
  webcam: Webcam;
};

export default function Peek({ webcam }: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [pauseAnimation, setPauseAnimation] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (webcam.panorama && imageRef.current && wrapperRef.current) {
      const interval = setInterval(() => {
        if (imageRef.current && wrapperRef.current) {
          wrapperRef.current.scrollLeft += 1;
        }
      }, 1000 / 60);

      if (pauseAnimation) {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }
  }, [pauseAnimation]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <motion.div
        layoutId={webcam.name}
        className="relative border-[3px] border-white bg-slate-700 bg-loading-spinner bg-center bg-50% bg-no-repeat rounded-xl shadow-2xl"
      >
        <div
          ref={wrapperRef}
          onTouchStart={() => setPauseAnimation(true)}
          className="w-[95vw] h-[38vh] lg:h-[80vh] overflow-auto rounded-xl"
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingIcon size={56} />
            </div>
          )}
          <img
            ref={imageRef}
            src={webcam.fullsize + "?" + generateRefreshQuery()}
            className={joinClassNames([
              "w-auto h-full max-w-none",
              loading && "opacity-0",
            ])}
            loading="lazy"
            onLoad={() => setLoading(false)}
            alt={webcam.name}
          />
        </div>
        <Caption name={webcam.name} link={webcam.link} />
      </motion.div>
    </div>
  );
}
