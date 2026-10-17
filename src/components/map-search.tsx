'use client';

import NextLink from 'next/link';
import { type FC, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { fill } from '@/i18n/format';
import { useLocale, useMessages } from '@/i18n/messages-provider';
import type { Webcam } from '@/services/webcamData';
import { formatWebcamCount } from '@/utils/formatWebcamCount';
import { joinClasses } from '@/utils/joinClasses';
import { webcamsPath } from '@/utils/paths';
import type { Place } from '@/utils/places';
import { searchWebcams } from '@/utils/searchWebcams';
import { CloseIcon } from './icons/close';
import { SearchIcon } from './icons/search';

type Props = {
  webcams: Webcam[];
  places: Place[];
  onSelectWebcam: (webcam: Webcam) => void;
  onSelectPlace: (place: Place) => void;
  onClose: () => void;
};

const resultClasses =
  'focus:bg-tinte/10 hover:bg-tinte/10 flex w-full items-baseline justify-between gap-3 px-4 py-2 text-left outline-none';

// Finds a webcam or a place by name and takes the map there. Arrow keys walk from the field through the
// results, Enter takes the first result, Escape and a tap on the map close the panel
export const MapSearch: FC<Props> = ({ webcams, places, onSelectWebcam, onSelectPlace, onClose }) => {
  const { app, nav } = useMessages();
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const results = searchWebcams(query, webcams, places);
  const hasQuery = query.trim() !== '';

  // Focus returns to the search button when the panel closes
  useEffect(() => {
    const previouslyFocused = document.activeElement;

    return () => {
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, []);

  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const { target } = event;
      // The header's search button toggles the panel itself
      const isToggle = target instanceof Element && target.closest('[data-search-toggle]') !== null;

      if (target instanceof Node && !isToggle && !panelRef.current?.contains(target)) {
        onClose();
      }
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer);

    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [onClose]);

  const select = (index: number) => {
    const result = results[index];

    if (!result) {
      return;
    }

    if (result.kind === 'place') {
      onSelectPlace(result.place);
    } else {
      onSelectWebcam(result.webcam);
    }

    onClose();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();

      return;
    }

    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }

    const stops = [...(panelRef.current?.querySelectorAll<HTMLElement>('input, [data-result]') ?? [])];
    const current = stops.indexOf(document.activeElement as HTMLElement);
    const next = stops[(current + (event.key === 'ArrowDown' ? 1 : stops.length - 1)) % stops.length];

    event.preventDefault();
    next?.focus();
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: the panel only routes arrow keys and Escape for the field and the results inside it
    <div
      ref={panelRef}
      data-test-id="map-search"
      onKeyDown={handleKeyDown}
      className="on-light bg-firn text-tinte motion-safe:animate-rise pointer-events-auto w-full max-w-md overflow-hidden rounded-lg shadow-lg"
    >
      <div className="flex items-center gap-1 p-1">
        <span className="text-tinte/60 ms-2 flex shrink-0">
          <SearchIcon size={18} />
        </span>
        <input
          // A text field: the search type adds the browser's own clear button next to the panel's close button
          type="text"
          inputMode="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              select(0);
            }
          }}
          placeholder={app.searchPlaceholder}
          aria-label={app.search}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          // The panel only exists while the search is open, so the field takes the focus the button had
          // biome-ignore lint/a11y/noAutofocus: the search opens on an explicit tap or "/", focus belongs in the field
          autoFocus
          className="signage placeholder:text-tinte/50 h-9 min-w-0 grow bg-transparent px-2 text-base outline-none placeholder:font-normal placeholder:font-stretch-normal"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label={app.closeSearch}
          className="hover:bg-tinte/10 flex size-9 shrink-0 items-center justify-center rounded-md"
        >
          <CloseIcon size={16} />
        </button>
      </div>

      {hasQuery && (
        <ul className="border-tinte/10 max-h-[50vh] overflow-y-auto border-t py-1" aria-label={app.search}>
          {results.length === 0 ? (
            <li className="text-tinte/70 px-4 py-3 text-sm">{fill(app.searchNoResults, { query: query.trim() })}</li>
          ) : (
            results.map((result, index) => {
              const key = result.kind === 'place' ? `place-${result.place.slug}` : `webcam-${result.webcam.slug}`;
              const name = result.kind === 'place' ? result.place.name : result.webcam.name;
              const detail =
                result.kind === 'place' ? formatWebcamCount(app, result.place.webcams.length) : result.webcam.city.trim();

              return (
                <li key={key}>
                  <button type="button" data-result tabIndex={-1} onClick={() => select(index)} className={resultClasses}>
                    <span className={joinClasses(['signage truncate text-base', result.kind === 'webcam' && 'font-medium'])}>
                      {name}
                    </span>
                    {detail && <span className="text-tinte/70 shrink-0 text-sm">{detail}</span>}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}

      <div className="border-tinte/10 border-t px-4 py-2 text-sm">
        <NextLink
          href={webcamsPath(locale)}
          className="hover:decoration-current decoration-sonne font-medium underline decoration-2 underline-offset-4"
        >
          {nav.allWebcams}
        </NextLink>
      </div>
    </div>
  );
};
