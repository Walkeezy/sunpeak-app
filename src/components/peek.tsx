import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Webcam } from "../services/sheet";
import { joinClassNames } from "../utils/joinClassnames";
import Caption from "./caption";

type Props = {
  webcam: Webcam;
};

export default function Peek({ webcam }: Props): JSX.Element {
  const imageRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pauseAnimation, setPauseAnimation] = useState(false);

  const imgUrl = webcam.forceReload
    ? webcam.fullsize + "?" + Date.now()
    : webcam.fullsize;

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
        className="relative border-[3px] border-white bg-white rounded-xl shadow-2xl"
      >
        <div
          ref={wrapperRef}
          onTouchStart={() => setPauseAnimation(true)}
          className={joinClassNames([
            "w-[95vw] h-[38vh] lg:h-[80vh] overflow-auto rounded-xl",
            !webcam.panorama && "max-w-[1000px]",
          ])}
        >
          <img
            ref={imageRef}
            src={imgUrl}
            className="w-auto h-full max-w-none"
          />
        </div>
        <Caption name={webcam.name} link={webcam.link} />
      </motion.div>
    </div>
  );
}
