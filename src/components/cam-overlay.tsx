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

const FOCUSABLE_SELECTOR = 'button, a[href]';

export const CamOverlay: FC<Props> = ({ webcam, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [pauseAnimation, setPauseAnimation] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!webcam.panorama || pauseAnimation) {
      return;
    }

    const interval = setInterval(() => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollLeft += 1;
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [webcam.panorama, pauseAnimation]);

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
  }, [onClose]);

  // Move focus into the dialog on open and restore it on close
  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();

    return () => {
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') {
        return;
      }

      const focusable = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)];

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener('keydown', trapFocus);

    return () => {
      dialog.removeEventListener('keydown', trapFocus);
    };
  }, []);

  // Lazy initializer keeps the window access out of render and only evaluates it once on mount
  const [isDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth > 1024);
  const webcamSrc = isDesktop ? convertToLargeRoundshotUrl(webcam.fullsize) : webcam.fullsize;

  return (
    <div className="fixed inset-0 z-1000 overflow-hidden" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={webcam.name}
        onClick={(event) => event.stopPropagation()}
        className="absolute top-[28vh] left-[2vw] h-[42vh] w-[96vw] lg:top-[10vh] lg:h-[80vh]"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close webcam view"
          className="absolute -top-10 right-0 rounded-sm bg-white px-2 py-1 text-base shadow-md"
        >
          ✕
        </button>
        <div className="bg-slate relative h-full w-full overflow-hidden rounded-xl border-[2px] border-white shadow-2xl">
          <div ref={wrapperRef} onPointerDown={() => setPauseAnimation(true)} className="h-full w-full overflow-scroll">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingIcon size={56} />
              </div>
            )}
            <picture>
              <img
                src={webcamSrc + '?' + generateRefreshQuery()}
                className={joinClasses(['mx-auto h-full w-auto max-w-none', loading && 'opacity-0'])}
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
