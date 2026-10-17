'use client';

import type { FC } from 'react';
import { useMessages } from '@/i18n/messages-provider';
import { LAYERS, type LayerName, type LayerVisibility } from '@/layers';
import { joinClasses } from '@/utils/joinClasses';

type Props = {
  visibility: LayerVisibility;
  onToggle: (layer: LayerName) => void;
};

// Each toggle shows the marker it switches on, so the bar is the map's legend as well as its control
const glyphs: Record<LayerName, FC> = {
  Webcams: () => (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="1.5" width="15" height="15" rx="3.5" />
      <circle cx="9" cy="9" r="3" />
    </svg>
  ),
  Temperature: () => (
    <span className="flex size-[18px] items-center justify-center rounded-full border-[1.5px] border-current text-[11px] leading-none">
      °
    </span>
  ),
  Sunshine: () => (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="9" cy="9" r="3.5" fill="currentColor" />
      <path
        strokeLinecap="round"
        d="M9 1.5v1.75M9 14.75v1.75M1.5 9h1.75M14.75 9h1.75M3.7 3.7l1.24 1.24M13.06 13.06l1.24 1.24M3.7 14.3l1.24-1.24M13.06 4.94l1.24-1.24"
      />
    </svg>
  ),
  Wind: () => (
    <svg aria-hidden="true" width="18" height="18" viewBox="44 4 32 32" fill="currentColor">
      <path d="M60 7 L70 20 A14 14 0 1 1 50 20 Z" />
    </svg>
  ),
};

// The layer name is the cookie key and test id; the label comes from the messages
export const LayerToggles: FC<Props> = ({ visibility, onToggle }) => {
  const { app } = useMessages();

  return (
    <fieldset className="on-light bg-firn text-tinte absolute bottom-[calc(env(safe-area-inset-bottom)+0.625rem)] left-[0.625rem] z-[1000] flex gap-1 rounded-lg p-1 shadow-md">
      <legend className="sr-only">{app.layersLegend}</legend>
      {LAYERS.map((layer) => {
        const Glyph = glyphs[layer];
        const isOn = visibility[layer];

        return (
          <button
            key={layer}
            type="button"
            aria-pressed={isOn}
            title={app.layers[layer]}
            data-test-id={`layer-toggle-${layer.toLowerCase()}`}
            onClick={() => onToggle(layer)}
            className={joinClasses([
              'signage flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm transition-colors',
              isOn ? 'bg-tinte text-firn' : 'text-tinte/55 hover:bg-tinte/10',
            ])}
          >
            <Glyph />
            {/* Four labels don't fit next to the locate button on a phone; there the glyphs carry the legend */}
            <span className="sr-only sm:not-sr-only">{app.layers[layer]}</span>
          </button>
        );
      })}
    </fieldset>
  );
};
