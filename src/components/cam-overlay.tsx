'use client';

import { type FC, useEffect, useRef, useState } from 'react';
import type { Webcam } from '@/services/webcamData';
import { convertToLargeRoundshotUrl } from '@/utils/convertToLargeRoundshotUrl';
import { withRefreshQuery } from '@/utils/generateRefreshQuery';
import { joinClasses } from '@/utils/joinClasses';
import { Caption } from './caption';
import { LoadingIcon } from './icons/loading';

type Props = {
  webcam: Webcam;
  refreshQuery: string;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR = 'button, a[href]';

export const CamOverlay: FC<Props> = ({ webcam, refreshQuery, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [failed, setFailed] = useState(false);
  // Lazy initializer keeps the window access out of render and only evaluates it once on mount
  const [pauseAnimation, setPauseAnimation] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!webcam.panorama || pauseAnimation) {
      return;
    }

    let frame: number;
    let previous: number | undefined;
    // Tracked separately because browsers may round fractional scrollLeft values
    let position = wrapperRef.current?.scrollLeft ?? 0;

    // Scroll 60px per second, independent of the display refresh rate
    const step = (time: number) => {
      if (wrapperRef.current && previous !== undefined) {
        position += ((time - previous) * 60) / 1000;
        wrapperRef.current.scrollLeft = position;
      }
      previous = time;
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);

    return () => cancelAnimationFrame(frame);
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

  const [isDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth > 1024);
  const webcamSrc = isDesktop ? convertToLargeRoundshotUrl(webcam.fullsize) : webcam.fullsize;

  return (
    <div className="fixed inset-0 z-1000 overflow-hidden">
      <button type="button" tabIndex={-1} aria-hidden="true" className="absolute inset-0" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={webcam.name}
        className="absolute top-[28vh] left-[2vw] z-10 h-[42vh] w-[96vw] lg:top-[10vh] lg:h-[80vh]"
      >
        <button
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close webcam view"
          className="absolute -top-10 right-0 rounded-sm bg-white px-2 py-1 text-base shadow-md"
        >
          ✕
        </button>
        <div className="bg-slate relative h-full w-full overflow-hidden rounded-xl border-[2px] border-white shadow-2xl">
          <div ref={wrapperRef} onPointerDown={() => setPauseAnimation(true)} className="h-full w-full overflow-scroll">
            {loading && !failed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingIcon size={56} />
              </div>
            )}
            {failed && (
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-white">
                This webcam image is currently unavailable
              </div>
            )}
            <img
              src={withRefreshQuery(webcamSrc, refreshQuery)}
              className={joinClasses(['mx-auto h-full w-auto max-w-none', (loading || failed) && 'opacity-0'])}
              onLoad={() => setLoading(false)}
              onError={() => setFailed(true)}
              alt={webcam.name}
            />
          </div>
        </div>
        <Caption name={webcam.name} link={webcam.link} />
      </div>
    </div>
  );
};
