import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Webcam } from '../services/webcamData';
import { convertToLargeRoundshotUrl } from '../utils/convertToLargeRoundshotUrl';
import { generateRefreshQuery } from '../utils/generateRefreshQuery';
import { joinClasses } from '../utils/joinClasses';
import Caption from './caption';
import LoadingIcon from './icons/loading';

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
  const webcamSrc = isDesktop ? convertToLargeRoundshotUrl(webcam.fullsize) : webcam.fullsize;

  return (
    <div className="fixed left-[2.5vw] top-[28vh] h-[42vh] w-[95vw] lg:top-[10vh] lg:h-[80vh]">
      <motion.div
        data-test-id="cam-peek"
        layoutId={`${webcam.name}-${webcam.city}`}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.7 }}
        className="bg-loading-spinner bg-50% relative h-full w-full overflow-hidden rounded-xl border-[3px] border-white bg-slate-700 bg-center bg-no-repeat shadow-2xl"
      >
        <div ref={wrapperRef} onTouchStart={() => setPauseAnimation(true)} className="h-full w-full overflow-scroll">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingIcon size={56} />
            </div>
          )}
          <picture>
            <img
              ref={imageRef}
              src={webcamSrc + '?' + generateRefreshQuery()}
              className={joinClasses(['h-full w-auto max-w-none', loading && 'opacity-0'])}
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
