import type { Metadata } from 'next';
import Link from 'next/link';
import { textLinkClasses } from '@/components/externalLink';
import { Header } from '@/components/header';
import { iconButtonClasses } from '@/components/icon-button';
import { BackIcon } from '@/components/icons/back';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';
import { WebcamThumbnail } from '@/components/webcam-image';
import { fill, rich } from '@/i18n/format';
import { getMessages } from '@/i18n/messages';
import { localizedAlternates, localizedOpenGraph } from '@/i18n/metadata';
import { requireLocale } from '@/i18n/server';
import { settle } from '@/services/sourceResult';
import { getWebcamData } from '@/services/webcamData';
import { generateRefreshQuery, withRefreshQuery } from '@/utils/generateRefreshQuery';
import { mapPath, webcamPagePath } from '@/utils/paths';
import { webcamSubtitle } from '@/utils/webcamSubtitle';

// Static, regenerated hourly like the webcam list itself
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<'/[locale]/webcams'>): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const { meta } = getMessages(locale);

  return {
    title: meta.webcamsTitle,
    description: meta.webcamsDescription,
    alternates: localizedAlternates(locale, '/webcams'),
    openGraph: localizedOpenGraph(locale, {
      title: meta.webcamsTitle,
      description: meta.webcamsDescription,
      path: '/webcams',
    }),
  };
}

export default async function WebcamsPage({ params }: PageProps<'/[locale]/webcams'>) {
  const locale = requireLocale((await params).locale);
  const { nav, app, webcams: t } = getMessages(locale);
  const { data: webcams, ok } = await settle(getWebcamData(), []);
  const refreshQuery = generateRefreshQuery();
  const collator = new Intl.Collator(locale === 'de' ? 'de-CH' : locale);
  const sorted = webcams.toSorted((a, b) => collator.compare(a.name, b.name));

  return (
    <div className="bg-nacht text-firn flex min-h-dvh flex-col">
      <Header>
        <Link href={mapPath(locale)} title={nav.backToMap} className={iconButtonClasses}>
          <BackIcon />
        </Link>
        <Logo as="span" />
        <LanguageSwitcher className="ms-auto" />
      </Header>

      <main data-test-id="webcams-page" className="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6">
        <h1 className="signage text-4xl leading-none">{t.heading}</h1>
        <p className="text-firn/70 mt-4 max-w-[65ch] text-[17px] leading-relaxed">
          {rich(t.intro, {
            map: (
              <Link href={mapPath(locale)} className={textLinkClasses}>
                {t.mapLink}
              </Link>
            ),
          })}
        </p>

        {ok ? (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {sorted.map((webcam) => {
              const subtitle = webcamSubtitle(webcam, app.webcamAltitude, locale);

              return (
                <li key={webcam.slug}>
                  <Link href={webcamPagePath(locale, webcam.slug)} className="group block rounded-lg">
                    <WebcamThumbnail
                      src={withRefreshQuery(webcam.thumbnail, refreshQuery)}
                      alt={fill(webcam.city ? t.webcamAltWithCity : t.webcamAlt, { name: webcam.name, city: webcam.city })}
                    />
                    <span className="signage group-hover:text-sonne mt-2 block truncate text-base leading-tight transition-colors">
                      {webcam.name}
                    </span>
                    {subtitle && <span className="text-firn/70 block truncate text-sm">{subtitle}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p role="alert" className="bg-sonne text-tinte signage mt-8 rounded-lg px-4 py-3 text-sm">
            {t.loadFailed}
          </p>
        )}
      </main>
    </div>
  );
}
