import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { textLinkClasses } from '@/components/externalLink';
import { Header } from '@/components/header';
import { iconButtonClasses } from '@/components/icon-button';
import { BackIcon } from '@/components/icons/back';
import { LinkIcon } from '@/components/icons/link';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';
import { WebcamCard, webcamGridClasses } from '@/components/webcam-card';
import { WebcamImage } from '@/components/webcam-image';
import { SITE_URL } from '@/config';
import type { Locale } from '@/i18n/config';
import { fill, rich } from '@/i18n/format';
import { getMessages } from '@/i18n/messages';
import { localizedAlternates, localizedOpenGraph } from '@/i18n/metadata';
import { requireLocale } from '@/i18n/server';
import type { Messages } from '@/messages/types';
import { settle } from '@/services/sourceResult';
import { getTemperatureData } from '@/services/temperatureData';
import { getWebcamData, type Webcam } from '@/services/webcamData';
import { convertToLargeRoundshotUrl } from '@/utils/convertToLargeRoundshotUrl';
import { formatAltitude } from '@/utils/formatAltitude';
import { formatDistance } from '@/utils/formatDistance';
import { generateRefreshQuery, withRefreshQuery } from '@/utils/generateRefreshQuery';
import { nearestMeasurement } from '@/utils/nearestMeasurement';
import { nearestStationText } from '@/utils/nearestStationText';
import { mapPath, mapWithWebcamPath, placePagePath, webcamPagePath, webcamsPath } from '@/utils/paths';
import { findPlace, groupByPlace, nearestWebcams, placeSlugOf } from '@/utils/places';
import { serializeJsonLd, webcamJsonLd } from '@/utils/webcamJsonLd';

// Static and regenerated in the background. This is the ceiling: the ten-minute temperature fetch sets the actual
// pace, and every regeneration also rotates the image cache-buster
export const revalidate = 900;

// How many other webcams are shown under the picture
const NEARBY_WEBCAMS = 6;

// Runs once per locale from the layout; the webcam list itself is cached, so the sheet is read once
export async function generateStaticParams() {
  try {
    const webcams = await getWebcamData();

    return webcams.map(({ slug }) => ({ slug }));
  } catch (error) {
    // Without Sheets credentials (e.g. the CI build) the pages are rendered on their first request instead
    console.error('Webcam pages are not prerendered, they will render on demand:', error);

    return [];
  }
}

const findWebcam = async (slug: string): Promise<{ webcam: Webcam; webcams: Webcam[] }> => {
  const webcams = await getWebcamData();
  const webcam = webcams.find((candidate) => candidate.slug === slug);

  if (!webcam) {
    notFound();
  }

  return { webcam, webcams };
};

const webcamTitle = ({ meta }: Messages, { name, city }: Webcam) =>
  fill(city ? meta.webcamTitleWithCity : meta.webcamTitle, { name, city });

const webcamDescription = ({ webcam: t }: Messages, { name, city }: Webcam) =>
  fill(city ? t.descriptionWithCity : t.description, { name, city });

const localeAndSlug = async (params: PageProps<'/[locale]/webcams/[slug]'>['params']): Promise<[Locale, string]> => {
  const { locale, slug } = await params;

  return [requireLocale(locale), slug];
};

export async function generateMetadata({ params }: PageProps<'/[locale]/webcams/[slug]'>): Promise<Metadata> {
  const [locale, slug] = await localeAndSlug(params);
  const messages = getMessages(locale);
  const { webcam } = await findWebcam(slug);
  const title = webcamTitle(messages, webcam);
  const description = webcamDescription(messages, webcam);
  const path = `/webcams/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: localizedOpenGraph(locale, { title, description, path, images: [{ url: webcam.fullsize, alt: title }] }),
    twitter: { card: 'summary_large_image' },
  };
}

export default async function WebcamPage({ params }: PageProps<'/[locale]/webcams/[slug]'>) {
  const [locale, slug] = await localeAndSlug(params);
  const messages = getMessages(locale);
  const { nav, app, meta, webcams: index, webcam: t } = messages;
  const [{ webcam, webcams }, temperatures] = await Promise.all([findWebcam(slug), settle(getTemperatureData(), [])]);
  const refreshQuery = generateRefreshQuery();
  const nearest = nearestMeasurement(temperatures.data, webcam.latitude, webcam.longitude);
  const place = findPlace(groupByPlace(webcams).places, placeSlugOf(webcam));
  const nearby = nearestWebcams(webcam, webcams, NEARBY_WEBCAMS);
  const title = webcamTitle(messages, webcam);
  const altitude =
    webcam.altitude === undefined
      ? undefined
      : fill(app.webcamAltitude, { altitude: formatAltitude(webcam.altitude, locale) });
  const jsonLd = webcamJsonLd({
    webcam,
    title,
    description: webcamDescription(messages, webcam),
    locale,
    breadcrumbs: [
      { name: 'Sunpeak', url: `${SITE_URL}${mapPath(locale)}` },
      { name: nav.allWebcams, url: `${SITE_URL}${webcamsPath(locale)}` },
      ...(place ? [{ name: place.name, url: `${SITE_URL}${placePagePath(locale, place.slug)}` }] : []),
      { name: webcam.name, url: `${SITE_URL}${webcamPagePath(locale, slug)}` },
    ],
  });

  return (
    <div className="bg-nacht text-firn flex min-h-dvh flex-col">
      <Header>
        <Link
          href={place ? placePagePath(locale, place.slug) : webcamsPath(locale)}
          title={place ? fill(t.allInPlace, { place: place.name }) : nav.allWebcams}
          className={iconButtonClasses}
        >
          <BackIcon />
        </Link>
        <Logo as="span" />
        <LanguageSwitcher className="ms-auto" />
      </Header>

      <main data-test-id="webcam-page" className="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6">
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data has to be inline JSON; serializeJsonLd escapes "<" so values can't break out
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
        <h1 className="signage text-4xl leading-none">{fill(meta.webcamTitle, { name: webcam.name })}</h1>
        {(place || altitude) && (
          <p className="text-firn/70 signage mt-2 text-xl">
            {place && (
              <Link href={placePagePath(locale, place.slug)} className="hover:text-sonne transition-colors">
                {place.name}
              </Link>
            )}
            {place && altitude && ' · '}
            {altitude}
          </p>
        )}

        <figure className="mt-6">
          <WebcamImage
            src={withRefreshQuery(webcam.fullsize, refreshQuery)}
            largeSrc={withRefreshQuery(convertToLargeRoundshotUrl(webcam.fullsize), refreshQuery)}
            alt={title}
            panorama={webcam.panorama}
          />
          <figcaption className="text-firn/70 mt-3 text-sm">
            {t.liveCaption}
            {nearest && <> {fill(t.nearestStation, { station: nearestStationText(t, nearest) })}</>}
          </figcaption>
        </figure>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={mapWithWebcamPath(locale, slug)}
            className="bg-sonne text-tinte signage hover:bg-firn flex h-11 items-center rounded-lg px-5 text-base transition-colors"
          >
            {t.openOnMap}
          </Link>
          <a
            href={webcam.link}
            target="_blank"
            rel="noopener noreferrer"
            className="border-firn/30 signage hover:border-firn flex h-11 items-center gap-2 rounded-lg border px-5 text-base transition-colors"
          >
            {t.website}
            <LinkIcon />
          </a>
        </div>

        <p className="text-firn/70 mt-10 max-w-[65ch] text-[17px] leading-relaxed">
          {webcamDescription(messages, webcam)}{' '}
          {rich(t.about, {
            webcams: (
              <Link href={webcamsPath(locale)} className={textLinkClasses}>
                {t.allWebcamsLink}
              </Link>
            ),
          })}
        </p>

        {nearby.length > 0 && (
          <section className="mt-12">
            <h2 className="signage text-2xl leading-none">{t.nearby}</h2>
            <ul className={`mt-4 ${webcamGridClasses}`}>
              {nearby.map((other) => (
                <li key={other.slug}>
                  <WebcamCard
                    href={webcamPagePath(locale, other.slug)}
                    src={withRefreshQuery(other.thumbnail, refreshQuery)}
                    alt={fill(other.city ? index.webcamAltWithCity : index.webcamAlt, {
                      name: other.name,
                      city: other.city,
                    })}
                    name={other.name}
                    detail={[other.city.trim(), formatDistance(t, other.distanceKm)].filter(Boolean).join(' · ')}
                  />
                </li>
              ))}
            </ul>
            {place && place.webcams.length > 1 && (
              <p className="mt-6 text-[17px]">
                <Link href={placePagePath(locale, place.slug)} className={textLinkClasses}>
                  {fill(t.allInPlace, { place: place.name })}
                </Link>
              </p>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
