// The map's layers. The name is the cookie key and test id; the labels come from the messages
export const LAYERS = ['Webcams', 'Temperature', 'Sunshine', 'Wind'] as const;

export type LayerName = (typeof LAYERS)[number];

export type LayerVisibility = Record<LayerName, boolean>;

// Without a saved choice: everything but the busy wind arrows
export const DEFAULT_LAYER_VISIBILITY: LayerVisibility = {
  Webcams: true,
  Temperature: true,
  Sunshine: true,
  Wind: false,
};

export const isLayerName = (value: string): value is LayerName => LAYERS.includes(value as LayerName);
