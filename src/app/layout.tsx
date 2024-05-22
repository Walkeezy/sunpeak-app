import { Analytics } from '@vercel/analytics/react';
import { ReactNode } from 'react';
import '../styles/globals.css';
import { lexend } from './fonts';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={`${lexend.variable} text-primary-700 font-sans font-medium antialiased`}>
      <body>
        <main>{children}</main>
      </body>
      <Analytics />
    </html>
  );
}
