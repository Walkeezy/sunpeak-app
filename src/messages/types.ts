import type { LayerName } from '@/components/layer-toggles';
import type { CompassPoint } from '@/utils/compassDirection';
import type { DataLoadError } from '@/utils/dataLoadErrorMessage';

// Every user-facing string. Values are plain strings so they can cross into client components;
// {name} placeholders are filled with fill() or rich() from @/i18n/format
export type Messages = {
  // Page titles and descriptions for search engines and link previews
  meta: {
    siteTitle: string;
    siteDescription: string;
    infoTitle: string;
    webcamsTitle: string;
    webcamsDescription: string;
    webcamTitle: string;
    webcamTitleWithCity: string;
    notFoundTitle: string;
  };
  // Header links, shared by every page
  nav: {
    backToMap: string;
    allWebcams: string;
    info: string;
    // Name of the other language, written in that language, e.g. "English" on the German pages
    otherLanguage: string;
  };
  // The map and its controls
  app: {
    refresh: string;
    updated: string;
    loadFailed: string;
    loadErrors: Record<DataLoadError, string>;
    locationFailed: string;
    dismiss: string;
    layersLegend: string;
    layers: Record<LayerName, string>;
    showLocation: string;
    closeWebcam: string;
    imageUnavailable: string;
    openWebcamSite: string;
  };
  // The popup of a weather station on the map
  station: {
    fallbackName: string;
    altitude: string;
    temperature: string;
    gusts: string;
    gustFrom: string;
    gustSpeed: string;
    measuredAt: string;
    close: string;
    compass: Record<CompassPoint, string>;
  };
  info: {
    heading: string;
    intro: string;
    webcamsTerm: string;
    webcamsDetail: string;
    browseWebcams: string;
    weatherTerm: string;
    weatherDetail: string;
    meteoswissName: string;
    meteoswissUrl: string;
    sourceTerm: string;
    sourceDetail: string;
    sourceLink: string;
    feedback: string;
  };
  webcams: {
    heading: string;
    intro: string;
    mapLink: string;
    loadFailed: string;
    webcamAlt: string;
    webcamAltWithCity: string;
  };
  webcam: {
    description: string;
    descriptionWithCity: string;
    liveCaption: string;
    nearestStation: string;
    station: string;
    stationWithTime: string;
    stationFallback: string;
    distanceUnderOneKm: string;
    distanceKm: string;
    openOnMap: string;
    website: string;
    about: string;
    allWebcamsLink: string;
  };
  notFound: {
    heading: string;
    text: string;
    links: string;
    mapLink: string;
    webcamsLink: string;
  };
};

// The part of the messages client components read through MessagesProvider
export type ClientMessages = Pick<Messages, 'nav' | 'app' | 'station'>;
