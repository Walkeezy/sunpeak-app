import Head from 'next/head';
import Link from 'next/link';
import ExternalLink from '../components/externalLink';
import Header from '../components/header';
import BackIcon from '../components/icons/back';
import Logo from '../components/logo';

export default function InfoPage() {
  return (
    <>
      <Head>
        <title>Sunpeak App – Info</title>
      </Head>

      <Header>
        <Link href="/" title="Go to back to home page">
          <BackIcon />
        </Link>
        <Logo />
        <div></div>
      </Header>

      <main data-test-id="info-page" className="p-8 space-y-4">
        <p>
          This interactive map displays webcams from all over Switzerland, giving you a real-time glimpse of the current
          weather conditions and helping you plan your next outdoor adventure.
        </p>
        <p>All webcams are manually collected and directly loaded from public URLs.</p>
        <p>
          The map is build with{' '}
          <ExternalLink href="https://www.geo.admin.ch/en/geo-services/geo-services/portrayal-services-web-mapping/web-map-tiling-services-wmts.html">
            Swisstopo WMTS
          </ExternalLink>
          .
        </p>
        <p>
          This app is open source and{' '}
          <ExternalLink href="https://github.com/Walkeezy/sunpeak-app">available on GitHub</ExternalLink>.
        </p>
        <p>
          Questions and feedback? You can reach me at{' '}
          <ExternalLink href="mailto:kevinwalker.ch">mail@kevinwalker.ch</ExternalLink>.
        </p>
      </main>
    </>
  );
}
