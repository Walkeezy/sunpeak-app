import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import { archivo } from '@/app/fonts';
import { splashScreens } from '@/app/splash-screens';
import { SITE_URL } from '@/config';
import { DEFAULT_LOCALE, hasLocale, LOCALES } from '@/i18n/config';
import { clientMessages, getMessages } from '@/i18n/messages';
import { MessagesProvider } from '@/i18n/messages-provider';
import '@/styles/globals.css';

// Shared by every page; titles, descriptions and Open Graph come from each page in its language
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s – Sunpeak App',
    default: 'Sunpeak App',
  },
  referrer: 'origin-when-cross-origin',
  creator: 'Kevin Walker',
  applicationName: 'Sunpeak',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Sunpeak',
    statusBarStyle: 'black-translucent',
    startupImage: splashScreens,
  },
  icons: [
    { rel: 'icon', sizes: '32x32', url: '/favicon-32x32.png' },
    { rel: 'icon', sizes: '16x16', url: '/favicon-16x16.png' },
    { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
  ],
};

export const viewport: Viewport = {
  themeColor: '#334155',
  viewportFit: 'cover',
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  // Never notFound() here: Next doesn't allow it in a root layout. Pages reject unknown locales themselves
  const { locale: value } = await params;
  const locale = hasLocale(value) ? value : DEFAULT_LOCALE;

  return (
    <html lang={locale} className={`${archivo.variable} bg-schiefer font-sans antialiased`}>
      <body className="bg-schiefer text-firn">
        <MessagesProvider locale={locale} messages={clientMessages(getMessages(locale))}>
          {children}
        </MessagesProvider>
        <Analytics />
      </body>
    </html>
  );
}
