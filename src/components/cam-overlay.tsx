'use client';

import { type FC, useEffect, useRef, useState } from 'react';
import { useMessages } from '@/i18n/messages-provider';
import type { Temperature } from '@/services/temperatureData';
import type { Webcam } from '@/services/webcamData';
import { convertToLargeRoundshotUrl } from '@/utils/convertToLargeRoundshotUrl';
import { withRefreshQuery } from '@/utils/generateRefreshQuery';
import { joinClasses } from '@/utils/joinClasses';
import type { NearestMeasurement } from '@/utils/nearestMeasurement';
import { Caption } from './caption';
import { CloseIcon } from './icons/close';
import { LoadingIcon } from './icons/loading';

type Props = {
  webcam: Webcam;
  nearest?: NearestMeasurement<Temperature>;
  refreshQuery: string;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR = 'button, a[href]';

export const CamOverlay: FC<Props> = ({ webcam, nearest, refreshQuery, onClose }) => {
  const { app } = useMessages();
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

  const image = (
    // biome-ignore lint/performance/noImgElement: webcam images come from many external hosts and are cache-busted, so next/image doesn't fit
    <img
      src={withRefreshQuery(webcamSrc, refreshQuery)}
      className={joinClasses([
        // A panorama keeps its height and scrolls sideways; any other picture fits the screen whole
        webcam.panorama ? 'mx-auto h-full w-auto max-w-none' : 'block h-auto max-h-[70vh] w-auto max-w-full lg:max-h-[76vh]',
        (loading || failed) && 'opacity-0',
      ])}
      onLoad={() => setLoading(false)}
      onError={() => setFailed(true)}
      alt={webcam.name}
    />
  );

  return (
    <div className="bg-nacht/70 fixed inset-0 z-[1100] flex items-center justify-center overflow-hidden p-3 lg:px-[8vw]">
      <button type="button" tabIndex={-1} aria-hidden="true" className="absolute inset-0" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={webcam.name}
        className="motion-safe:animate-rise relative z-10 flex w-full max-w-full flex-col items-center"
      >
        <div
          className={joinClasses([
            'bg-schiefer relative max-w-full overflow-hidden rounded-lg shadow-2xl',
            // Room for the spinner and the error text until the picture has its own size
            webcam.panorama ? 'h-[50vh] w-full lg:h-[76vh]' : 'min-h-[12rem] min-w-[16rem]',
          ])}
        >
          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label={app.closeWebcam}
            className="on-light bg-firn/90 text-tinte absolute top-2 right-2 z-10 flex size-11 items-center justify-center rounded-full shadow-md transition-colors hover:bg-white"
          >
            <CloseIcon />
          </button>
          {loading && !failed && (
            <div className="text-firn absolute inset-0 flex items-center justify-center">
              <LoadingIcon size={56} />
            </div>
          )}
          {failed && (
            <div className="text-firn absolute inset-0 flex items-center justify-center p-4 text-center">
              {app.imageUnavailable}
            </div>
          )}
          {webcam.panorama ? (
            <div ref={wrapperRef} onPointerDown={() => setPauseAnimation(true)} className="h-full w-full overflow-scroll">
              {image}
            </div>
          ) : (
            image
          )}
        </div>
        <Caption webcam={webcam} nearest={nearest} />
      </div>
    </div>
  );
};
