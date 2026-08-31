import { Analytics } from '@vercel/analytics/react';
import type { ReactNode } from 'react';
import { lexend } from './fonts';
import '@/styles/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} font-sans font-medium antialiased`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
