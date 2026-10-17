import type { Locale } from '@/i18n/config';
import type { Webcam } from '@/services/webcamData';
import type { Place } from './places';

type Breadcrumb = { name: string; url: string };

// Absolute URLs from the site's start page down to the page itself, which comes last
type Breadcrumbs = [Breadcrumb, ...Breadcrumb[]];

const pageUrlOf = (breadcrumbs: Breadcrumbs) => breadcrumbs[breadcrumbs.length - 1].url;

const breadcrumbList = (breadcrumbs: Breadcrumbs) => ({
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbs.map(({ name, url }, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    item: url,
  })),
});

const swissAddress = (locality: string) => ({
  '@type': 'PostalAddress',
  addressLocality: locality,
  addressCountry: 'CH',
});

// The picture a webcam page shows, linked to the webcam's page by its @id
const imageObject = (webcam: Webcam, pageUrl: string) => ({
  '@type': 'ImageObject',
  '@id': `${pageUrl}#webcam`,
  url: pageUrl,
  contentUrl: webcam.fullsize,
  thumbnailUrl: webcam.thumbnail,
});

type WebcamInput = {
  webcam: Webcam;
  title: string;
  description: string;
  locale: Locale;
  breadcrumbs: Breadcrumbs;
};

// schema.org data for a webcam page: the live picture with where it was taken, and the page's place in the site
export const webcamJsonLd = ({ webcam, title, description, locale, breadcrumbs }: WebcamInput) => {
  const pageUrl = pageUrlOf(breadcrumbs);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...imageObject(webcam, pageUrl),
        name: title,
        description,
        inLanguage: locale,
        contentLocation: {
          '@type': 'Place',
          name: webcam.city ? `${webcam.name}, ${webcam.city}` : webcam.name,
          geo: {
            '@type': 'GeoCoordinates',
            latitude: webcam.latitude,
            longitude: webcam.longitude,
            ...(webcam.altitude === undefined ? {} : { elevation: webcam.altitude }),
          },
          ...(webcam.city ? { address: swissAddress(webcam.city) } : {}),
        },
      },
      breadcrumbList(breadcrumbs),
    ],
  };
};

type PlaceInput = {
  place: Place;
  title: string;
  description: string;
  locale: Locale;
  breadcrumbs: Breadcrumbs;
  // Absolute URL of a webcam's own page
  webcamUrl: (webcam: Webcam) => string;
};

// Rounded so the centre of a place doesn't carry a dozen meaningless decimals
const coordinate = (value: number) => Math.round(value * 1e5) / 1e5;

// schema.org data for a place's page: the town and the list of its webcams, each pointing at its own page
export const placeJsonLd = ({ place, title, description, locale, breadcrumbs, webcamUrl }: PlaceInput) => {
  const pageUrl = pageUrlOf(breadcrumbs);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': pageUrl,
        name: title,
        description,
        url: pageUrl,
        inLanguage: locale,
        about: {
          '@type': 'Place',
          name: place.name,
          address: swissAddress(place.name),
          geo: { '@type': 'GeoCoordinates', latitude: coordinate(place.latitude), longitude: coordinate(place.longitude) },
        },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: place.webcams.length,
          itemListElement: place.webcams.map((webcam, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: { ...imageObject(webcam, webcamUrl(webcam)), name: webcam.name },
          })),
        },
      },
      breadcrumbList(breadcrumbs),
    ],
  };
};

// For a <script type="application/ld+json">: escapes "<" so a value can't close the script tag
export const serializeJsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c');
