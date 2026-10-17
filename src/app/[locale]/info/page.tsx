import type { Metadata } from 'next';
import Link from 'next/link';
import { ExternalLink, textLinkClasses } from '@/components/externalLink';
import { Header } from '@/components/header';
import { iconButtonClasses } from '@/components/icon-button';
import { BackIcon } from '@/components/icons/back';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';
import { rich } from '@/i18n/format';
import { getMessages } from '@/i18n/messages';
import { localizedAlternates, localizedOpenGraph } from '@/i18n/metadata';
import { requireLocale } from '@/i18n/server';
import { mapPath, webcamsPath } from '@/utils/paths';

export async function generateMetadata({ params }: PageProps<'/[locale]/info'>): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const { meta } = getMessages(locale);

  return {
    title: meta.infoTitle,
    description: meta.siteDescription,
    alternates: localizedAlternates(locale, '/info'),
    openGraph: localizedOpenGraph(locale, { title: meta.siteTitle, description: meta.siteDescription, path: '/info' }),
  };
}

export default async function InfoPage({ params }: PageProps<'/[locale]/info'>) {
  const locale = requireLocale((await params).locale);
  const { nav, info } = getMessages(locale);

  const facts = [
    {
      term: info.webcamsTerm,
      detail: rich(info.webcamsDetail, {
        browse: (
          <Link href={webcamsPath(locale)} className={textLinkClasses}>
            {info.browseWebcams}
          </Link>
        ),
      }),
    },
    {
      term: info.weatherTerm,
      detail: rich(info.weatherDetail, {
        meteoswiss: <ExternalLink href={info.meteoswissUrl}>{info.meteoswissName}</ExternalLink>,
      }),
    },
    {
      term: info.sourceTerm,
      detail: rich(info.sourceDetail, {
        github: <ExternalLink href="https://github.com/Walkeezy/sunpeak-app">{info.sourceLink}</ExternalLink>,
      }),
    },
  ];

  return (
    <div className="on-light bg-firn text-tinte flex min-h-dvh flex-col">
      <Header>
        <Link href={mapPath(locale)} title={nav.backToMap} className={iconButtonClasses}>
          <BackIcon />
        </Link>
        <Logo as="span" />
        <LanguageSwitcher className="ms-auto" />
      </Header>

      <main data-test-id="info-page" className="mx-auto w-full max-w-[65ch] px-6 pt-10 pb-16 text-[17px] leading-relaxed">
        <h1 className="signage text-4xl leading-none">{info.heading}</h1>
        <p className="mt-5">{info.intro}</p>

        <dl className="divide-tinte/10 border-tinte/10 mt-10 divide-y border-y">
          {facts.map(({ term, detail }) => (
            <div key={term} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="signage text-lg leading-snug">{term}</dt>
              <dd>{detail}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10">
          {rich(info.feedback, {
            mail: <ExternalLink href="mailto:mail@kevinwalker.ch">mail@kevinwalker.ch</ExternalLink>,
          })}
        </p>
      </main>
    </div>
  );
}
