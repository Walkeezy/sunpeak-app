import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { NextRequest } from 'next/server';
import { describe, expect, test } from 'vitest';
import { LOCALES } from '@/i18n/config';
import { config, proxy } from './proxy';

const redirectTarget = (url: string, headers: Record<string, string> = {}) => {
  const response = proxy(new NextRequest(url, { headers }));

  return { status: response.status, location: response.headers.get('location') };
};

const matches = (url: string) => unstable_doesMiddlewareMatch({ config, url });

describe('proxy matcher', () => {
  test('runs on unprefixed pages', () => {
    expect(matches('/')).toBe(true);
    expect(matches('/info')).toBe(true);
    expect(matches('/webcams/saentis')).toBe(true);
    expect(matches('/delta')).toBe(true);
  });

  test('skips localized pages for every locale', () => {
    for (const locale of LOCALES) {
      expect(matches(`/${locale}`)).toBe(false);
      expect(matches(`/${locale}/webcams/saentis`)).toBe(false);
    }
  });

  test('skips files and Next internals', () => {
    expect(matches('/sitemap.xml')).toBe(false);
    expect(matches('/robots.txt')).toBe(false);
    expect(matches('/manifest.json')).toBe(false);
    expect(matches('/splash_screens/iPhone_16_Pro_portrait.png')).toBe(false);
    expect(matches('/_next/static/chunks/main.js')).toBe(false);
    // Vercel Analytics posts page views to a path without a dot
    expect(matches('/_vercel/insights/view')).toBe(false);
  });
});

describe('proxy', () => {
  test('defaults to German', () => {
    expect(redirectTarget('https://sunpeak.app/')).toEqual({ status: 307, location: 'https://sunpeak.app/de' });
  });

  test('follows the browser language', () => {
    expect(redirectTarget('https://sunpeak.app/info', { 'accept-language': 'en-GB,en;q=0.9' }).location).toBe(
      'https://sunpeak.app/en/info',
    );
  });

  test('prefers the language picked with the switcher', () => {
    expect(redirectTarget('https://sunpeak.app/', { 'accept-language': 'en', cookie: 'locale=de' }).location).toBe(
      'https://sunpeak.app/de',
    );
  });

  test('ignores an unknown cookie value', () => {
    expect(redirectTarget('https://sunpeak.app/', { 'accept-language': 'en', cookie: 'locale=fr' }).location).toBe(
      'https://sunpeak.app/en',
    );
  });

  test('keeps search params', () => {
    expect(redirectTarget('https://sunpeak.app/?cam=saentis').location).toBe('https://sunpeak.app/de?cam=saentis');
  });

  test('lets localized paths through', () => {
    expect(proxy(new NextRequest('https://sunpeak.app/en/info')).headers.get('location')).toBeNull();
  });
});
