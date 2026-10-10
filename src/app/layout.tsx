import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { archivo } from './fonts';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sunpeak.app'),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#334155',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} bg-schiefer font-sans antialiased`}>
      <body className="bg-schiefer text-firn">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
