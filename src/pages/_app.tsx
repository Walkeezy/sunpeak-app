import { Analytics } from '@vercel/analytics/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'ol/ol.css';
import { StrictMode } from 'react';
import '../styles/globals.css';

function SunpeakApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, maximum-scale=1.0, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <StrictMode>
        <Component {...pageProps} />
      </StrictMode>
      <Analytics />
    </>
  );
}

export default SunpeakApp;
