import type { AppProps } from "next/app";
import "ol/ol.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
