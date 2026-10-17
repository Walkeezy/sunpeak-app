import { type NextRequest, NextResponse } from 'next/server';
import { DEFAULT_LOCALE, hasLocale, LOCALE_COOKIE } from '@/i18n/config';
import { negotiateLocale } from '@/i18n/negotiate';

// Sends unprefixed URLs to their localized version: the language picked with the switcher first,
// then the browser language, then German. Search params such as ?cam= are kept
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (hasLocale(pathname.split('/')[1])) {
    return NextResponse.next();
  }

  const preferred = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = hasLocale(preferred)
    ? preferred
    : (negotiateLocale(request.headers.get('accept-language')) ?? DEFAULT_LOCALE);

  const url = request.nextUrl.clone();
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;

  // Temporary: the target depends on the visitor, and browsers cache permanent redirects
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skips localized paths, Next internals and every path with a dot (sitemap.xml, robots.txt, manifest.json,
  // icons, splash screens). The locale list has to be written out: matchers must be static
  matcher: ['/((?!de(?:/|$)|en(?:/|$)|api|_next|__next|_vercel|.*\\..*).*)'],
};
