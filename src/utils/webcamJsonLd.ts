import type { Locale } from '@/i18n/config';
import type { Webcam } from '@/services/webcamData';

type Breadcrumb = { name: string; url: string };

type Input = {
  webcam: Webcam;
  title: string;
  description: string;
  locale: Locale;
  // Absolute URLs, from the site's start page down to this webcam's page
  breadcrumbs: [Breadcrumb, Breadcrumb, Breadcrumb];
};

// schema.org data for a webcam page: the live picture with where it was taken, and the page's place in the site
export const webcamJsonLd = ({ webcam, title, description, locale, breadcrumbs }: Input) => {
  const pageUrl = breadcrumbs[2].url;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ImageObject',
        '@id': `${pageUrl}#webcam`,
        name: title,
        description,
        url: pageUrl,
        contentUrl: webcam.fullsize,
        thumbnailUrl: webcam.thumbnail,
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
          ...(webcam.city
            ? { address: { '@type': 'PostalAddress', addressLocality: webcam.city, addressCountry: 'CH' } }
            : {}),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map(({ name, url }, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name,
          item: url,
        })),
      },
    ],
  };
};

// For a <script type="application/ld+json">: escapes "<" so a value can't close the script tag
export const serializeJsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c');
