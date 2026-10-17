// Builds public/map-style-dark.json, Sunpeak's night version of swisstopo's light base map.
// Run `npm run map:style` after swisstopo publishes a new style version, then review the map and commit.
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { darkenColor, mapColors, parseColor } from './map-style-colors.mjs';

const SOURCE = 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.lightbasemap.vt/style.json';
const TARGET = path.join(import.meta.dirname, '..', 'public', 'map-style-dark.json');

const NIGHT = 'rgba(31, 42, 58, 1)'; // --color-nacht
const SUN = 'rgba(251, 184, 41, 1)'; // --color-sonne

// Roads keep their light-to-dark order: light fill, darker casing
const SHADE_LAYERS = new Set([
  'road_casing',
  'road_fill',
  'l1_road_casing',
  'l1_fill',
  'l2_road_casing',
  'l2_fill',
  'tunnel_road',
]);

const response = await fetch(SOURCE);

if (!response.ok) {
  throw new Error(`Could not load the swisstopo style: ${response.status}`);
}

const style = await response.json();

style.name = 'Sunpeak night, based on swisstopo lightbasemap';

style.layers = style.layers.map((layer) => {
  if (layer.id === 'background') {
    return { ...layer, paint: { ...layer.paint, 'background-color': NIGHT } };
  }

  // swisstopo tints sunny slopes faintly yellow; on the night ground the tint becomes the app's sun, a bit stronger
  if (layer.id === 'hillshade_yellow') {
    return {
      ...layer,
      paint: {
        ...layer.paint,
        'fill-color': SUN,
        'fill-opacity': ['interpolate', ['linear'], ['zoom'], 9, 0.03, 11, 0.045],
      },
    };
  }

  const mode =
    layer.id === 'hillshade_grey'
      ? 'relief'
      : SHADE_LAYERS.has(layer.id)
        ? 'shade'
        : layer.type === 'fill'
          ? 'surface'
          : 'invert';
  const paint = Object.fromEntries(
    Object.entries(layer.paint ?? {}).map(([key, value]) => [
      key,
      key.endsWith('-color') ? mapColors(value, (color) => darkenColor(color, mode)) : value,
    ]),
  );

  return { ...layer, paint };
});

// Every colour must have been understood; a new colour syntax would otherwise slip through light
const leftover = JSON.stringify(style.layers).match(/"(#[0-9a-f]{3,8}|(?:rgba?|hsla?)\([^)]*\))"/gi) ?? [];
const unparsed = leftover.filter((color) => !parseColor(JSON.parse(color)));

if (unparsed.length > 0) {
  throw new Error(`Colours left unparsed: ${unparsed.join(', ')}`);
}

await writeFile(TARGET, `${JSON.stringify(style)}\n`);
console.info(`Wrote ${path.relative(process.cwd(), TARGET)} from ${SOURCE}`);
