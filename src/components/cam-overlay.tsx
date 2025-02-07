'use client';

import { FC, useEffect, useRef, useState } from 'react';
import { Webcam } from '../services/webcamData';
import { convertToLargeRoundshotUrl } from '../utils/convertToLargeRoundshotUrl';
import { generateRefreshQuery } from '../utils/generateRefreshQuery';
import { joinClasses } from '../utils/joinClasses';
import { Caption } from './caption';
import { LoadingIcon } from './icons/loading';

type Props = {
  webcam: Webcam;
  onClose: () => void;
};

export const CamOverlay: FC<Props> = ({ webcam, onClose }) => {
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

  useEffect(() => {
    const closeWebcam = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', closeWebcam);

    return () => {
      window.removeEventListener('keydown', closeWebcam);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isDesktop = window.innerWidth > 1024;
  const webcamSrc = isDesktop ? convertToLargeRoundshotUrl(webcam.fullsize) : webcam.fullsize;

  return (
    <div className="fixed inset-0 z-1000 overflow-hidden" onClick={onClose}>
      <div className="absolute top-[28vh] left-[2vw] h-[42vh] w-[96vw] lg:top-[10vh] lg:h-[80vh]">
        <div className="bg-loading-spinner bg-50% relative h-full w-full overflow-hidden rounded-xl border-[2px] border-white bg-slate-700 bg-center bg-no-repeat shadow-2xl">
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
                className={joinClasses(['mx-auto h-full w-auto max-w-none', loading && 'opacity-0'])}
                loading="lazy"
                onLoad={() => setLoading(false)}
                alt={webcam.name}
              />
            </picture>
          </div>
        </div>
        <Caption name={webcam.name} link={webcam.link} />
      </div>
    </div>
  );
};
