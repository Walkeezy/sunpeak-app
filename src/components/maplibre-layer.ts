import { DomUtil, Layer, type LeafletEvent, type Map as LeafletMap, Point, Util, type ZoomAnimEvent } from 'leaflet';
import type { Map as MaplibreMap } from 'maplibre-gl';

export type Maplibre = typeof import('maplibre-gl');

// Render beyond each edge so a quick pan doesn't reveal blank borders before the next frame
const PADDING = 0.1;
// MapLibre's 512px tiles sit one zoom level below Leaflet's 256px ones
const ZOOM_OFFSET = 1;
const UPDATE_INTERVAL_MS = 32;

// Draws a MapLibre map in Leaflet's tile pane and keeps it in step with Leaflet's view, so the markers and
// controls stay plain Leaflet. Adapted from @maplibre/maplibre-gl-leaflet (ISC license), which bundles
// MapLibre; this layer takes the module as a parameter so it can be loaded natively from /vendor
export class MaplibreLayer extends Layer {
  private glMap: MaplibreMap | undefined;
  private container: HTMLDivElement | undefined;
  // Layer point of the map container's top left corner, kept current while Leaflet zooms
  private containerOrigin = new Point(0, 0);
  private zooming = false;

  constructor(
    private readonly maplibre: Maplibre,
    private readonly style: string,
    private readonly attributionHtml: string,
  ) {
    super();
  }

  override onAdd(map: LeafletMap): this {
    const container = DomUtil.create('div', 'leaflet-gl-layer');
    this.container = container;
    this.resizeContainer(map);
    DomUtil.setPosition(container, this.topLeft(map));
    map.getPane('tilePane')?.appendChild(container);

    const center = map.getCenter();
    this.glMap = new this.maplibre.Map({
      container,
      style: this.style,
      center: [center.lng, center.lat],
      zoom: map.getZoom() - ZOOM_OFFSET,
      interactive: false,
      attributionControl: false,
      // Leaflet already keeps the view inside the bounds; MapLibre must follow it without clamping on its own
      transformConstrain: (lngLat, zoom) => ({ center: lngLat, zoom }),
    });

    const canvas = this.glMap.getCanvas();
    // Lets Leaflet's zoom animation CSS apply to the canvas like it does to tiles
    DomUtil.addClass(canvas, 'leaflet-image-layer');
    DomUtil.addClass(canvas, 'leaflet-zoom-animated');
    this.containerOrigin = map.containerPointToLayerPoint([0, 0]);

    return this;
  }

  override onRemove(): this {
    this.glMap?.remove();
    this.container?.remove();
    this.glMap = undefined;
    this.container = undefined;

    return this;
  }

  override getEvents() {
    return {
      move: this.throttledUpdate,
      zoomanim: this.animateZoom,
      zoom: this.pinchZoom,
      zoomstart: this.zoomStart,
      zoomend: this.zoomEnd,
      resize: this.resize,
    };
  }

  override getAttribution(): string {
    return this.attributionHtml;
  }

  private size(map: LeafletMap): Point {
    return map.getSize().multiplyBy(1 + PADDING * 2);
  }

  private topLeft(map: LeafletMap): Point {
    return map.containerPointToLayerPoint([0, 0]).subtract(map.getSize().multiplyBy(PADDING)).round();
  }

  private resizeContainer(map: LeafletMap) {
    const { x, y } = this.size(map);

    if (this.container) {
      this.container.style.width = `${x}px`;
      this.container.style.height = `${y}px`;
    }
  }

  private jumpToLeafletView(map: LeafletMap, glMap: MaplibreMap) {
    const center = map.getCenter();
    glMap.jumpTo({ center: [center.lng, center.lat], zoom: map.getZoom() - ZOOM_OFFSET });
  }

  private readonly update = () => {
    const map = this._map;

    if (!map || !this.container || !this.glMap) {
      return;
    }

    this.containerOrigin = map.containerPointToLayerPoint([0, 0]);

    // During an animated zoom the canvas is scaled with CSS; it catches up in zoomEnd
    if (this.zooming) {
      return;
    }

    DomUtil.setPosition(this.container, this.topLeft(map));
    this.jumpToLeafletView(map, this.glMap);
  };

  private readonly throttledUpdate = Util.throttle(this.update, UPDATE_INTERVAL_MS, this);

  // Scales and moves the current canvas towards the target view, matching Leaflet's own tile animation
  private readonly animateZoom = (event: LeafletEvent) => {
    const map = this._map;
    const mapPane = map?.getPane('mapPane');

    if (!map || !mapPane || !this.glMap) {
      return;
    }

    const { center, zoom } = event as ZoomAnimEvent;
    const scale = map.getZoomScale(zoom);
    const padding = map.getSize().multiplyBy(PADDING * scale);
    const viewHalf = this.size(map).divideBy(2);
    const topLeft = map.project(center, zoom).subtract(viewHalf).add(DomUtil.getPosition(mapPane).add(padding)).round();
    const offset = map.project(map.getBounds().getNorthWest(), zoom).subtract(topLeft);

    DomUtil.setTransform(this.glMap.getCanvas(), offset.subtract(this.containerOrigin), scale);
  };

  // Pinch zoom moves without an animation, so MapLibre follows directly
  private readonly pinchZoom = () => {
    const map = this._map;

    if (map && this.glMap) {
      this.jumpToLeafletView(map, this.glMap);
    }
  };

  private readonly zoomStart = () => {
    this.zooming = true;
  };

  private readonly zoomEnd = () => {
    if (this.glMap) {
      DomUtil.setTransform(this.glMap.getCanvas(), new Point(0, 0), 1);
    }

    this.zooming = false;
    this.update();
  };

  private readonly resize = () => {
    const map = this._map;

    if (map) {
      this.resizeContainer(map);
      this.update();
    }
  };
}
