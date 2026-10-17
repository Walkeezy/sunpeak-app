// Colour helpers for scripts/build-map-style.mjs: parse the colours of a MapLibre style and move them onto
// Sunpeak's night palette

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const COLOR = /^(rgba?|hsla?)\(\s*([^)]+)\)$|^#([0-9a-f]{3,8})$/i;

// Returns { h, s, l, a } with h in degrees and s, l, a between 0 and 1, or undefined for anything else
export const parseColor = (value) => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const match = COLOR.exec(value.trim());

  if (!match) {
    return undefined;
  }

  if (match[3]) {
    const hex = match[3].length <= 4 ? [...match[3]].map((digit) => digit + digit).join('') : match[3];
    const [r, g, b, a = 255] = hex.match(/../g).map((pair) => Number.parseInt(pair, 16));

    return { ...rgbToHsl(r, g, b), a: a / 255 };
  }

  const parts = match[2].split(',').map((part) => part.trim());

  if (match[1].toLowerCase().startsWith('rgb')) {
    const [r, g, b] = parts.slice(0, 3).map(Number);

    return { ...rgbToHsl(r, g, b), a: parts[3] === undefined ? 1 : Number(parts[3]) };
  }

  const [h, s, l] = parts.slice(0, 3).map((part) => Number.parseFloat(part));

  return { h, s: s / 100, l: l / 100, a: parts[3] === undefined ? 1 : Number(parts[3]) };
};

const rgbToHsl = (r, g, b) => {
  const [red, green, blue] = [r, g, b].map((channel) => channel / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l };
  }

  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const h =
    max === red
      ? (green - blue) / delta + (green < blue ? 6 : 0)
      : max === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4;

  return { h: h * 60, s, l };
};

const hslToRgb = ({ h, s, l }) => {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const channel = (n) => Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))));

  return [channel(0), channel(8), channel(4)];
};

export const formatColor = (color) => {
  const [r, g, b] = hslToRgb(color);

  return `rgba(${r}, ${g}, ${b}, ${Number(color.a.toFixed(3))})`;
};

// The palette the map is tuned to (src/styles/globals.css)
const NIGHT_HUE = 215;

// Lightness of the night ground (--color-nacht), which swisstopo's near-white background maps to
const GROUND = 0.17;
const PAPER = 0.99;

// How a layer's colours move onto the dark ground:
// invert: dark text and lines turn light, light halos turn dark
// surface: areas such as forest, water or glaciers sit just above the ground instead of jumping out of it
// relief: shaded slopes keep getting darker than the ground, so the mountains stay lit from the same side
// shade: keeps the order from light to dark in a mid range, for roads, which would otherwise turn into outlines
const MODES = {
  invert: ({ l }) => 0.9 - 0.75 * l,
  surface: ({ l }) => GROUND + (PAPER - l) * 0.35,
  relief: ({ l }) => GROUND - (PAPER - l) * 0.5,
  shade: ({ l }) => 0.1 + 0.3 * l,
};

// Muted and pulled towards the night blue, so the map recedes behind the markers
export const darkenColor = (color, mode = 'invert') => {
  const lightness = clamp(MODES[mode](color));
  const saturation = clamp(color.s * 0.55);
  // Greys and pale tones take on the night hue; saturated colours (water, rail lines) keep theirs
  const hue = color.s < 0.15 ? NIGHT_HUE : color.h;

  return { h: hue, s: color.s < 0.15 ? 0.18 : saturation, l: lightness, a: color.a };
};

// Walks a paint value, including expressions and stops, and replaces every colour string
export const mapColors = (value, transform) => {
  if (Array.isArray(value)) {
    return value.map((item) => mapColors(item, transform));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapColors(item, transform)]));
  }

  const color = parseColor(value);

  return color ? formatColor(transform(color)) : value;
};
