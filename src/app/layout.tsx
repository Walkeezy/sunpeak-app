import { Analytics } from '@vercel/analytics/react';
import { ReactNode } from 'react';
import '../styles/globals.css';
import { lexend } from './fonts';

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
