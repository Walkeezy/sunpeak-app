import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink } from '@/components/externalLink';
import { Header } from '@/components/header';
import { iconButtonClasses } from '@/components/icon-button';
import { BackIcon } from '@/components/icons/back';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
  title: 'Info – Sunpeak App — Webcams from all over Switzerland',
  description:
    "This interactive map displays webcams from all over Switzerland, giving you a real-time glimpse of the current weather conditions and helping you plan your next outdoor adventure. So why wait? Let's find out where the sun is shining today!",
};

const facts = [
  {
    term: 'Webcams',
    detail:
      "Collected by hand and loaded straight from their public addresses. Tap one on the map for the full picture, or follow the signpost to the webcam's own site.",
  },
  {
    term: 'Weather data',
    detail: (
      <>
        Temperature and wind are the latest ten-minute measurements from{' '}
        <ExternalLink href="https://www.meteoschweiz.admin.ch/">MeteoSwiss</ExternalLink>, the Federal Office of Meteorology
        and Climatology.
      </>
    ),
  },
  {
    term: 'Source code',
    detail: (
      <>
        Sunpeak is open source. The code is{' '}
        <ExternalLink href="https://github.com/Walkeezy/sunpeak-app">on GitHub</ExternalLink>.
      </>
    ),
  },
];

export default function InfoPage() {
  return (
    <div className="on-light bg-firn text-tinte flex min-h-dvh flex-col">
      <Header>
        <Link href="/" title="Go back to home page" className={iconButtonClasses}>
          <BackIcon />
        </Link>
        <Logo as="span" />
      </Header>

      <main data-test-id="info-page" className="mx-auto w-full max-w-[65ch] px-6 pt-10 pb-16 text-[17px] leading-relaxed">
        <h1 className="signage text-4xl leading-none">About Sunpeak</h1>
        <p className="mt-5">
          Live webcams from all over Switzerland on one map, with the current temperature and wind beside them. Look before
          you go, and find out where the sun is shining today.
        </p>

        <dl className="divide-tinte/10 border-tinte/10 mt-10 divide-y border-y">
          {facts.map(({ term, detail }) => (
            <div key={term} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="signage text-lg leading-snug">{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10">
          Questions and feedback? Write to <ExternalLink href="mailto:mail@kevinwalker.ch">mail@kevinwalker.ch</ExternalLink>
          .
        </p>
      </main>
    </div>
  );
}
