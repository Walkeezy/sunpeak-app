import { resolveSitemap } from 'next/dist/build/webpack/loaders/metadata/resolve-route-data';
import { describe, expect, test, vi } from 'vitest';
import type { Webcam } from '@/services/webcamData';
import sitemap from './sitemap';

const { getWebcamData } = vi.hoisted(() => ({ getWebcamData: vi.fn() }));

vi.mock('@/services/webcamData', () => ({ getWebcamData }));

const webcam = (overrides: Partial<Webcam> = {}): Webcam => ({
  slug: 'saentis',
  name: 'Säntis',
  city: 'Schwägalp',
  latitude: 47.25,
  longitude: 9.34,
  thumbnail: 'https://example.com/thumb.jpg',
  fullsize: 'https://example.com/full.jpg',
  link: 'https://example.com/link',
  panorama: false,
  ...overrides,
});

describe('sitemap', () => {
  test('stays well-formed xml when an image url has a query string', async () => {
    getWebcamData.mockResolvedValue([webcam({ fullsize: 'https://example.com/cam.jpg?a=1&b=2' })]);

    // Serialised the way Next serves it, so the test catches anything Next writes into the xml unescaped
    const xml = resolveSitemap(await sitemap());
    const document = new DOMParser().parseFromString(xml, 'application/xml');

    expect(document.querySelector('parsererror')).toBeNull();
    expect(document.getElementsByTagName('image:loc')[0]?.textContent).toBe('https://example.com/cam.jpg?a=1&b=2');
  });

  test('lists a page per place in every language, with the webcams as images', async () => {
    getWebcamData.mockResolvedValue([
      webcam({ slug: 'saentis', fullsize: 'https://example.com/saentis.jpg' }),
      webcam({ slug: 'kronberg', name: 'Kronberg', fullsize: 'https://example.com/kronberg.jpg' }),
      webcam({ slug: 'rothorn', name: 'Rothorn', city: 'Lenzerheide' }),
      webcam({ slug: 'nowhere', name: 'Nowhere', city: '' }),
    ]);

    const entries = await sitemap();
    const places = entries.filter(({ url }) => url.includes('/webcams/in/'));

    expect(places.map(({ url }) => url)).toEqual([
      'https://sunpeak.app/de/webcams/in/schwaegalp',
      'https://sunpeak.app/en/webcams/in/schwaegalp',
      'https://sunpeak.app/de/webcams/in/lenzerheide',
      'https://sunpeak.app/en/webcams/in/lenzerheide',
    ]);
    expect(places[0].alternates?.languages).toEqual({
      de: 'https://sunpeak.app/de/webcams/in/schwaegalp',
      en: 'https://sunpeak.app/en/webcams/in/schwaegalp',
      'x-default': 'https://sunpeak.app/de/webcams/in/schwaegalp',
    });
    expect(places[0].images).toEqual(['https://example.com/saentis.jpg', 'https://example.com/kronberg.jpg']);
  });
});
