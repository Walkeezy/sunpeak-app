import type { Metadata } from 'next';
import Link from 'next/link';
import { textLinkClasses } from '@/components/externalLink';
import { Header } from '@/components/header';
import { iconButtonClasses } from '@/components/icon-button';
import { BackIcon } from '@/components/icons/back';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';
import { WebcamCard, webcamGridClasses } from '@/components/webcam-card';
import { collator, fill, rich } from '@/i18n/format';
import { getMessages } from '@/i18n/messages';
import { localizedAlternates, localizedOpenGraph } from '@/i18n/metadata';
import { requireLocale } from '@/i18n/server';
import { settle } from '@/services/sourceResult';
import { getWebcamData } from '@/services/webcamData';
import { formatWebcamCount } from '@/utils/formatWebcamCount';
import { generateRefreshQuery, withRefreshQuery } from '@/utils/generateRefreshQuery';
import { mapPath, placePagePath, webcamPagePath } from '@/utils/paths';
import { groupByPlace } from '@/utils/places';
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
  const { nav, app, place, webcams: t } = getMessages(locale);
  const { data: webcams, ok } = await settle(getWebcamData(), []);
  const refreshQuery = generateRefreshQuery();
  const compare = collator(locale);
  const byName = (a: { name: string }, b: { name: string }) => compare.compare(a.name, b.name);
  // Sorting the webcams first keeps every place's webcams sorted too
  const { places, elsewhere } = groupByPlace(webcams.toSorted(byName));
  // One section per place, linking to the place's page, and one for webcams without a town
  const sections = [
    ...places.toSorted(byName).map(({ slug, name, webcams: members }) => ({
      key: slug,
      heading: name,
      href: placePagePath(locale, slug),
      webcams: members,
    })),
    ...(elsewhere.length > 0 ? [{ key: 'elsewhere', heading: t.elsewhere, href: undefined, webcams: elsewhere }] : []),
  ];

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
          sections.map(({ key, heading, href, webcams: members }) => (
            <section key={key} className="mt-10">
              <div className="flex items-baseline gap-3">
                <h2 className="signage text-2xl leading-none">
                  {href ? (
                    <Link href={href} className="hover:text-sonne transition-colors">
                      {heading}
                    </Link>
                  ) : (
                    heading
                  )}
                </h2>
                <span className="text-firn/70 text-sm">{formatWebcamCount(place, members.length)}</span>
              </div>
              <ul className={`mt-4 ${webcamGridClasses}`}>
                {members.map((webcam) => (
                  <li key={webcam.slug}>
                    <WebcamCard
                      href={webcamPagePath(locale, webcam.slug)}
                      src={withRefreshQuery(webcam.thumbnail, refreshQuery)}
                      alt={fill(webcam.city ? t.webcamAltWithCity : t.webcamAlt, { name: webcam.name, city: webcam.city })}
                      name={webcam.name}
                      // The town is the section's heading, so the card only adds the altitude
                      detail={webcamSubtitle({ city: '', altitude: webcam.altitude }, app.webcamAltitude, locale)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))
        ) : (
          <p role="alert" className="bg-sonne text-tinte signage mt-8 rounded-lg px-4 py-3 text-sm">
            {t.loadFailed}
          </p>
        )}
      </main>
    </div>
  );
}
