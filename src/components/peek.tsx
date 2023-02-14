import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Webcam } from "../services/sheet";
import { convertToLargeRoundshotUrl } from "../utils/convertToLargeRoundshotUrl";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseAnimation]);

  const isDesktop = window.innerWidth > 1024;
  const webcamSrc = isDesktop
    ? convertToLargeRoundshotUrl(webcam.fullsize)
    : webcam.fullsize;

  return (
    <div className="fixed w-[95vw] h-[42vh] lg:h-[80vh] top-[28vh] lg:top-[10vh] left-[2.5vw]">
      <motion.div
        layoutId={`${webcam.name}-${webcam.city}`}
        transition={{ type: "spring", bounce: 0.2, duration: 0.7 }}
        className="relative w-full h-full border-[3px] border-white bg-slate-700 bg-loading-spinner bg-center bg-50% bg-no-repeat rounded-xl overflow-hidden shadow-2xl"
      >
        <div
          ref={wrapperRef}
          onTouchStart={() => setPauseAnimation(true)}
          className="w-full h-full overflow-scroll"
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingIcon size={56} />
            </div>
          )}
          <picture>
            <img
              ref={imageRef}
              src={webcamSrc + "?" + generateRefreshQuery()}
              className={joinClassNames([
                "w-auto h-full max-w-none",
                loading && "opacity-0",
              ])}
              loading="lazy"
              onLoad={() => setLoading(false)}
              alt={webcam.name}
            />
          </picture>
        </div>
      </motion.div>
      <Caption name={webcam.name} link={webcam.link} />
    </div>
  );
}
