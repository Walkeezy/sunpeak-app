'use client';

import type { FC } from 'react';
import { joinClasses } from '@/utils/joinClasses';

export type LayerName = 'Webcams' | 'Temperature' | 'Wind';

export type LayerVisibility = Record<LayerName, boolean>;

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
  Wind: () => (
    <svg aria-hidden="true" width="18" height="18" viewBox="44 4 32 32" fill="currentColor">
      <path d="M60 7 L70 20 A14 14 0 1 1 50 20 Z" />
    </svg>
  ),
};

const layers: LayerName[] = ['Webcams', 'Temperature', 'Wind'];

export const LayerToggles: FC<Props> = ({ visibility, onToggle }) => (
  <fieldset className="on-light bg-firn text-tinte absolute bottom-[calc(env(safe-area-inset-bottom)+0.625rem)] left-[0.625rem] z-[1000] flex gap-1 rounded-lg p-1 shadow-md">
    <legend className="sr-only">Map layers</legend>
    {layers.map((layer) => {
      const Glyph = glyphs[layer];
      const isOn = visibility[layer];

      return (
        <button
          key={layer}
          type="button"
          aria-pressed={isOn}
          data-test-id={`layer-toggle-${layer.toLowerCase()}`}
          onClick={() => onToggle(layer)}
          className={joinClasses([
            'signage flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm transition-colors',
            isOn ? 'bg-tinte text-firn' : 'text-tinte/55 hover:bg-tinte/10',
          ])}
        >
          <Glyph />
          <span>{layer}</span>
        </button>
      );
    })}
  </fieldset>
);
