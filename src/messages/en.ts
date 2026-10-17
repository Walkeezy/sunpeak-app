import type { Messages } from './types';

export const en: Messages = {
  meta: {
    siteTitle: 'Sunpeak App – Webcams from all over Switzerland',
    siteDescription:
      "This interactive map displays webcams from all over Switzerland, giving you a real-time glimpse of the current weather conditions and helping you plan your next outdoor adventure. So why wait? Let's find out where the sun is shining today!",
    infoTitle: 'Info',
    webcamsTitle: 'All webcams',
    webcamsDescription:
      'Every live webcam on the Sunpeak map, from the Alps to the Jura. Open one for the full picture, the current temperature nearby and its spot on the map.',
    webcamTitle: 'Webcam {name}',
    webcamTitleWithCity: 'Webcam {name}, {city}',
    notFoundTitle: 'Page not found',
  },
  nav: {
    backToMap: 'Back to the map',
    allWebcams: 'All webcams',
    info: 'Info',
    otherLanguage: 'Deutsch',
  },
  app: {
    refresh: 'Refresh data',
    updated: 'Updated',
    loadFailed: 'Data could not be loaded',
    loadErrors: {
      webcamList: 'Webcam list could not be loaded',
      weatherData: 'Weather data could not be loaded',
    },
    locationFailed: 'Your location could not be determined',
    dismiss: 'Dismiss',
    layersLegend: 'Map layers',
    layers: {
      Webcams: 'Webcams',
      Temperature: 'Temperature',
      Wind: 'Wind',
    },
    showLocation: 'Show my location',
    closeWebcam: 'Close webcam view',
    imageUnavailable: 'This webcam image is currently unavailable',
    openWebcamSite: "Open {name} on the webcam's site",
  },
  info: {
    heading: 'About Sunpeak',
    intro:
      'Live webcams from all over Switzerland on one map, with the current temperature and wind beside them. Look before you go, and find out where the sun is shining today.',
    webcamsTerm: 'Webcams',
    webcamsDetail:
      "Collected by hand and loaded straight from their public addresses. Tap one on the map for the full picture and a link to the webcam's own site, or {browse}.",
    browseWebcams: 'browse all webcams',
    weatherTerm: 'Weather data',
    weatherDetail:
      'Temperature and wind are the latest ten-minute measurements from {meteoswiss}, the Federal Office of Meteorology and Climatology.',
    meteoswissName: 'MeteoSwiss',
    meteoswissUrl: 'https://www.meteoswiss.admin.ch/',
    sourceTerm: 'Source code',
    sourceDetail: 'Sunpeak is open source. The code is {github}.',
    sourceLink: 'on GitHub',
    feedback: 'Questions and feedback? Write to {mail}.',
  },
  webcams: {
    heading: 'All webcams',
    intro:
      'Live pictures from all over Switzerland, refreshed every few minutes. Open a webcam for the full picture, the temperature nearby and its spot on the {map}.',
    mapLink: 'map',
    loadFailed: 'The webcam list could not be loaded. Please try again later.',
    webcamAlt: 'Webcam {name}',
    webcamAltWithCity: 'Webcam {name}, {city}',
  },
  webcam: {
    description:
      'Live view from the {name} webcam in Switzerland, with the current temperature nearby. See where the sun is shining today on the Sunpeak map.',
    descriptionWithCity:
      'Live view from the {name} webcam in {city}, Switzerland, with the current temperature nearby. See where the sun is shining today on the Sunpeak map.',
    liveCaption: 'Live picture, refreshed every few minutes.',
    nearestStation: 'Nearest weather station: {station}.',
    station: '{name}, {distance} away: {value} °C',
    stationWithTime: '{name}, {distance} away: {value} °C at {time}',
    stationFallback: 'Weather station',
    distanceUnderOneKm: 'less than 1 km',
    distanceKm: '{km} km',
    openOnMap: 'Open on the map',
    website: 'Webcam website',
    about: 'Temperature and wind are the latest ten-minute measurements from MeteoSwiss. Browse {webcams}.',
    allWebcamsLink: 'all webcams',
  },
  notFound: {
    heading: 'Page not found',
    text: "This page doesn't exist, or the webcam has been taken off the map.",
    links: '{map} or browse {webcams}.',
    mapLink: 'Back to the map',
    webcamsLink: 'all webcams',
  },
};
