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
});
