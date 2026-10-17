'use client';

import { type FC, useEffect, useRef, useState } from 'react';
import { useMessages } from '@/i18n/messages-provider';
import { joinClasses } from '@/utils/joinClasses';
import { LoadingIcon } from './icons/loading';

const fallbackStyle = { backgroundImage: 'url(/webcam-fallback.svg)', backgroundSize: '50%' };

// Tracks whether an image has loaded or failed. These images are server-rendered, so a cached one may
// already be complete before React hydrates and the load or error event never reaches the handlers
const useImageStatus = () => {
  const ref = useRef<HTMLImageElement>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const image = ref.current;

    if (image?.complete) {
      if (image.naturalWidth > 0) {
        setLoading(false);
      } else {
        setFailed(true);
      }
    }
  }, []);

  return { ref, loading, failed, onLoad: () => setLoading(false), onError: () => setFailed(true) };
};

type HeroProps = {
  src: string;
  // Served to wide viewports instead of src, e.g. the larger Roundshot rendition
  largeSrc?: string;
  alt: string;
  panorama: boolean;
};

// The big picture on a webcam's page: panoramas keep their height and scroll sideways like in the map overlay
export const WebcamImage: FC<HeroProps> = ({ src, largeSrc, alt, panorama }) => {
  const { app } = useMessages();
  const { ref, loading, failed, onLoad, onError } = useImageStatus();

  return (
    <div
      className={joinClasses([
        'bg-schiefer relative overflow-hidden rounded-lg shadow-2xl',
        panorama ? 'h-[50vh] overflow-x-auto lg:h-[70vh]' : 'min-h-[12rem]',
      ])}
    >
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
      <picture>
        {largeSrc && largeSrc !== src && <source media="(min-width: 1024px)" srcSet={largeSrc} />}
        <img
          ref={ref}
          src={src}
          alt={alt}
          fetchPriority="high"
          onLoad={onLoad}
          onError={onError}
          className={joinClasses([
            panorama ? 'h-full w-auto max-w-none' : 'block h-auto w-full',
            (loading || failed) && 'opacity-0',
          ])}
        />
      </picture>
    </div>
  );
};

type ThumbnailProps = {
  src: string;
  alt: string;
};

// Card image in the webcam list; swaps to the fallback glyph when the host doesn't answer
export const WebcamThumbnail: FC<ThumbnailProps> = ({ src, alt }) => {
  const { ref, failed, onError } = useImageStatus();

  return (
    <div className="bg-schiefer aspect-[4/3] w-full overflow-hidden rounded-lg">
      {failed ? (
        <div role="img" aria-label={alt} className="h-full w-full bg-center bg-no-repeat" style={fallbackStyle} />
      ) : (
        // biome-ignore lint/performance/noImgElement: webcam images come from many external hosts and are cache-busted, so next/image doesn't fit
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={onError}
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
};
