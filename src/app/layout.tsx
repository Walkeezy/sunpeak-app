import { Analytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { lexend } from './fonts';
import '@/styles/globals.css';

export const metadata: Metadata = {
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
    <html lang="en" className={`${lexend.variable} bg-slate font-sans font-medium antialiased`}>
      <body className="bg-slate">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
