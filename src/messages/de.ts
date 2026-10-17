import type { Messages } from './types';

// Swiss Standard German: ss instead of ß
export const de: Messages = {
  meta: {
    siteTitle: 'Sunpeak App – Webcams aus der ganzen Schweiz',
    siteDescription:
      'Diese interaktive Karte zeigt Webcams aus der ganzen Schweiz. Sieh live, wie das Wetter gerade ist, und plane dein nächstes Abenteuer draussen. Finde heraus, wo heute die Sonne scheint!',
    infoTitle: 'Info',
    webcamsTitle: 'Alle Webcams',
    webcamsDescription:
      'Alle Live-Webcams der Sunpeak-Karte, von den Alpen bis in den Jura. Öffne eine Webcam für das ganze Bild, die aktuelle Temperatur in der Nähe und ihren Standort auf der Karte.',
    webcamTitle: 'Webcam {name}',
    webcamTitleWithCity: 'Webcam {name}, {city}',
    notFoundTitle: 'Seite nicht gefunden',
  },
  nav: {
    backToMap: 'Zurück zur Karte',
    allWebcams: 'Alle Webcams',
    info: 'Info',
    otherLanguage: 'English',
  },
  app: {
    refresh: 'Daten aktualisieren',
    updated: 'Aktualisiert',
    loadFailed: 'Daten konnten nicht geladen werden',
    loadErrors: {
      webcamList: 'Die Webcam-Liste konnte nicht geladen werden',
      weatherData: 'Die Wetterdaten konnten nicht geladen werden',
    },
    locationFailed: 'Dein Standort konnte nicht ermittelt werden',
    dismiss: 'Schliessen',
    layersLegend: 'Kartenebenen',
    layers: {
      Webcams: 'Webcams',
      Temperature: 'Temperatur',
      Wind: 'Böen',
    },
    showLocation: 'Meinen Standort zeigen',
    closeWebcam: 'Webcam schliessen',
    imageUnavailable: 'Dieses Webcam-Bild ist zurzeit nicht verfügbar',
    openWebcamSite: '{name} auf der Website der Webcam öffnen',
  },
  station: {
    fallbackName: 'Wetterstation',
    altitude: '{altitude} m ü. M.',
    temperature: 'Temperatur',
    gusts: 'Böen',
    gustFrom: '{speed} km/h aus {direction}',
    gustSpeed: '{speed} km/h',
    measuredAt: 'Gemessen um {time}',
    close: 'Schliessen',
    compass: { N: 'Nord', NE: 'Nordost', E: 'Ost', SE: 'Südost', S: 'Süd', SW: 'Südwest', W: 'West', NW: 'Nordwest' },
  },
  info: {
    heading: 'Über Sunpeak',
    intro:
      'Live-Webcams aus der ganzen Schweiz auf einer Karte, mit der aktuellen Temperatur und dem Wind daneben. Schau, bevor du gehst, und finde heraus, wo heute die Sonne scheint.',
    webcamsTerm: 'Webcams',
    webcamsDetail:
      'Von Hand gesammelt und direkt von ihren öffentlichen Adressen geladen. Tippe auf der Karte auf eine Webcam für das ganze Bild und einen Link zur Website der Webcam, oder {browse}.',
    browseWebcams: 'stöbere in allen Webcams',
    weatherTerm: 'Wetterdaten',
    weatherDetail:
      'Temperatur und Wind sind die neusten Zehn-Minuten-Messwerte von {meteoswiss}, dem Bundesamt für Meteorologie und Klimatologie.',
    meteoswissName: 'MeteoSchweiz',
    meteoswissUrl: 'https://www.meteoschweiz.admin.ch/',
    sourceTerm: 'Quellcode',
    sourceDetail: 'Sunpeak ist Open Source. Der Code liegt {github}.',
    sourceLink: 'auf GitHub',
    feedback: 'Fragen und Feedback? Schreib an {mail}.',
  },
  webcams: {
    heading: 'Alle Webcams',
    intro:
      'Live-Bilder aus der ganzen Schweiz, alle paar Minuten aktualisiert. Öffne eine Webcam für das ganze Bild, die Temperatur in der Nähe und ihren Standort auf der {map}.',
    mapLink: 'Karte',
    loadFailed: 'Die Webcam-Liste konnte nicht geladen werden. Bitte versuche es später noch einmal.',
    webcamAlt: 'Webcam {name}',
    webcamAltWithCity: 'Webcam {name}, {city}',
  },
  webcam: {
    description:
      'Live-Bild der Webcam {name} in der Schweiz, mit der aktuellen Temperatur in der Nähe. Finde auf der Sunpeak-Karte heraus, wo heute die Sonne scheint.',
    descriptionWithCity:
      'Live-Bild der Webcam {name} in {city}, Schweiz, mit der aktuellen Temperatur in der Nähe. Finde auf der Sunpeak-Karte heraus, wo heute die Sonne scheint.',
    liveCaption: 'Live-Bild, alle paar Minuten aktualisiert.',
    nearestStation: 'Nächste Wetterstation: {station}.',
    station: '{name}, {distance} entfernt: {value} °C',
    stationWithTime: '{name}, {distance} entfernt: {value} °C um {time}',
    stationFallback: 'Wetterstation',
    distanceUnderOneKm: 'weniger als 1 km',
    distanceKm: '{km} km',
    openOnMap: 'Auf der Karte zeigen',
    website: 'Website der Webcam',
    about: 'Temperatur und Wind sind die neusten Zehn-Minuten-Messwerte von MeteoSchweiz. Stöbere in {webcams}.',
    allWebcamsLink: 'allen Webcams',
  },
  notFound: {
    heading: 'Seite nicht gefunden',
    text: 'Diese Seite gibt es nicht, oder die Webcam wurde von der Karte genommen.',
    links: '{map} oder stöbere in {webcams}.',
    mapLink: 'Zurück zur Karte',
    webcamsLink: 'allen Webcams',
  },
};
