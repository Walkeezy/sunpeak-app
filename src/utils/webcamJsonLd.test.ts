import { describe, expect, test } from 'vitest';
import type { Webcam } from '@/services/webcamData';
import { serializeJsonLd, webcamJsonLd } from './webcamJsonLd';

const webcam: Webcam = {
  slug: 'saentis-schwaegalp',
  name: 'Säntis',
  city: 'Schwägalp',
  latitude: 47.2494,
  longitude: 9.3434,
  thumbnail: 'https://example.com/thumb.jpg',
  fullsize: 'https://example.com/full.jpg',
  link: 'https://example.com',
  panorama: true,
  altitude: 2501,
};

const breadcrumbs: Parameters<typeof webcamJsonLd>[0]['breadcrumbs'] = [
  { name: 'Sunpeak', url: 'https://sunpeak.app/de' },
  { name: 'Alle Webcams', url: 'https://sunpeak.app/de/webcams' },
  { name: 'Säntis', url: 'https://sunpeak.app/de/webcams/saentis-schwaegalp' },
];

describe('webcamJsonLd', () => {
  test('describes the picture with its place and the breadcrumb trail', () => {
    const data = webcamJsonLd({ webcam, title: 'Webcam Säntis, Schwägalp', description: 'Live', locale: 'de', breadcrumbs });
    const [image, trail] = data['@graph'];

    expect(image).toMatchObject({
      '@type': 'ImageObject',
      url: 'https://sunpeak.app/de/webcams/saentis-schwaegalp',
      contentUrl: 'https://example.com/full.jpg',
      inLanguage: 'de',
      contentLocation: {
        '@type': 'Place',
        name: 'Säntis, Schwägalp',
        geo: { '@type': 'GeoCoordinates', latitude: 47.2494, longitude: 9.3434, elevation: 2501 },
        address: { addressLocality: 'Schwägalp', addressCountry: 'CH' },
      },
    });
    expect(trail).toEqual({
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map(({ name, url }, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name,
        item: url,
      })),
    });
  });

  test('leaves out unknown altitude and place', () => {
    const [image] = webcamJsonLd({
      webcam: { ...webcam, city: '', altitude: undefined },
      title: 'Webcam Säntis',
      description: 'Live',
      locale: 'en',
      breadcrumbs,
    })['@graph'];

    expect(image).not.toHaveProperty('contentLocation.address');
    expect(image).not.toHaveProperty('contentLocation.geo.elevation');
  });
});

describe('serializeJsonLd', () => {
  test('keeps a value from closing the script tag', () => {
    const json = serializeJsonLd({ name: '</script><script>alert(1)</script>' });

    expect(json).not.toContain('<');
    expect(JSON.parse(json)).toEqual({ name: '</script><script>alert(1)</script>' });
  });
});
