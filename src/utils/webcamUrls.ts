// The search param that opens a webcam on the map, e.g. /?cam=saentis-schwaegalp
export const CAM_SEARCH_PARAM = 'cam';

// The webcam's own, indexable page
export const webcamPagePath = (slug: string): string => `/webcams/${encodeURIComponent(slug)}`;

// The map with the webcam opened in the overlay
export const mapWithWebcamPath = (slug: string): string => `/?${CAM_SEARCH_PARAM}=${encodeURIComponent(slug)}`;
