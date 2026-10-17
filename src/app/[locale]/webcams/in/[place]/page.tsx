import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { textLinkClasses } from '@/components/externalLink';
import { Header } from '@/components/header';
import { iconButtonClasses } from '@/components/icon-button';
import { BackIcon } from '@/components/icons/back';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';
import { WebcamCard, webcamGridClasses } from '@/components/webcam-card';
import { SITE_URL } from '@/config';
import type { Locale } from '@/i18n/config';
import { collator, fill, rich } from '@/i18n/format';
import { getMessages } from '@/i18n/messages';
import { localizedAlternates, localizedOpenGraph } from '@/i18n/metadata';
import { requireLocale } from '@/i18n/server';
import type { Messages } from '@/messages/types';
import { settle } from '@/services/sourceResult';
import { getTemperatureData, type Temperature } from '@/services/temperatureData';
import { getWebcamData } from '@/services/webcamData';
import { formatAltitude } from '@/utils/formatAltitude';
import { formatDistance } from '@/utils/formatDistance';
import { formatWebcamCount } from '@/utils/formatWebcamCount';
import { generateRefreshQuery, withRefreshQuery } from '@/utils/generateRefreshQuery';
import { type NearestMeasurement, nearestMeasurement } from '@/utils/nearestMeasurement';
import { nearestStationText } from '@/utils/nearestStationText';
import { mapPath, mapWithWebcamPath, placePagePath, webcamPagePath, webcamsPath } from '@/utils/paths';
import { altitudeRange, centralWebcam, findPlace, groupByPlace, nearbyPlaces, type Place } from '@/utils/places';
import { placeJsonLd, serializeJsonLd } from '@/utils/webcamJsonLd';
import { webcamSubtitle } from '@/utils/webcamSubtitle';

// Static and regenerated in the background, like a webcam's page: the ten-minute temperature sets the pace
export const revalidate = 900;

// How many other places are suggested at the end of the page
const NEARBY_PLACES = 8;

// Runs once per locale from the layout; the webcam list itself is cached, so the sheet is read once
export async function generateStaticParams() {
  try {
    const { places } = groupByPlace(await getWebcamData());

    return places.map(({ slug }) => ({ place: slug }));
  } catch (error) {
    // Without Sheets credentials (e.g. the CI build) the pages are rendered on their first request instead
    console.error('Place pages are not prerendered, they will render on demand:', error);

    return [];
  }
}

const loadPlace = async (slug: string): Promise<{ place: Place; places: Place[] }> => {
  const { places } = groupByPlace(await getWebcamData());
  const place = findPlace(places, slug);

  if (!place) {
    notFound();
  }

  return { place, places };
};

const placeTitle = ({ meta }: Messages, { name }: Place) => fill(meta.placeTitle, { place: name });

const placeDescription = ({ meta }: Messages, { name, webcams }: Place) =>
  webcams.length === 1
    ? fill(meta.placeDescriptionOne, { place: name })
    : fill(meta.placeDescription, { place: name, count: webcams.length });

// "3 live webcams show what the weather in Lenzerheide is like right now. They sit between 1,484 and 2,865 m
// above sea level. Nearest weather station: Arosa, 7 km away: 4.2 °C at 10:10."
const introText = (
  { place: t, webcam }: Messages,
  place: Place,
  locale: Locale,
  nearest: NearestMeasurement<Temperature> | undefined,
): string => {
  const count = place.webcams.length;
  const range = altitudeRange(place.webcams);
  const sentences = [count === 1 ? fill(t.introOne, { place: place.name }) : fill(t.intro, { place: place.name, count })];

  if (range && count === 1) {
    sentences.push(fill(t.altitudeOne, { altitude: formatAltitude(range.min, locale) }));
  } else if (range && range.min !== range.max) {
    sentences.push(
      fill(t.altitudeRange, { min: formatAltitude(range.min, locale), max: formatAltitude(range.max, locale) }),
    );
  }

  if (nearest) {
    sentences.push(fill(webcam.nearestStation, { station: nearestStationText(webcam, nearest) }));
  }

  return sentences.join(' ');
};

const localeAndSlug = async (params: PageProps<'/[locale]/webcams/in/[place]'>['params']): Promise<[Locale, string]> => {
  const { locale, place } = await params;

  return [requireLocale(locale), place];
};

export async function generateMetadata({ params }: PageProps<'/[locale]/webcams/in/[place]'>): Promise<Metadata> {
  const [locale, slug] = await localeAndSlug(params);
  const messages = getMessages(locale);
  const { place } = await loadPlace(slug);
  const title = placeTitle(messages, place);
  const description = placeDescription(messages, place);
  const path = `/webcams/in/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: localizedAlternates(locale, path),
    openGraph: localizedOpenGraph(locale, {
      title,
      description,
      path,
      images: [{ url: centralWebcam(place).fullsize, alt: title }],
    }),
    twitter: { card: 'summary_large_image' },
  };
}

export default async function PlacePage({ params }: PageProps<'/[locale]/webcams/in/[place]'>) {
  const [locale, slug] = await localeAndSlug(params);
  const messages = getMessages(locale);
  const { nav, app, webcams: index, webcam: w, place: t } = messages;
  const [{ place, places }, temperatures] = await Promise.all([loadPlace(slug), settle(getTemperatureData(), [])]);
  const refreshQuery = generateRefreshQuery();
  const compare = collator(locale);
  const webcams = place.webcams.toSorted((a, b) => compare.compare(a.name, b.name));
  const nearest = nearestMeasurement(temperatures.data, place.latitude, place.longitude);
  const nearby = nearbyPlaces(place, places, NEARBY_PLACES);
  const title = placeTitle(messages, place);
  const jsonLd = placeJsonLd({
    place,
    title,
    description: placeDescription(messages, place),
    locale,
    breadcrumbs: [
      { name: 'Sunpeak', url: `${SITE_URL}${mapPath(locale)}` },
      { name: nav.allWebcams, url: `${SITE_URL}${webcamsPath(locale)}` },
      { name: place.name, url: `${SITE_URL}${placePagePath(locale, slug)}` },
    ],
    webcamUrl: (webcam) => `${SITE_URL}${webcamPagePath(locale, webcam.slug)}`,
  });

  return (
    <div className="bg-nacht text-firn flex min-h-dvh flex-col">
      <Header>
        <Link href={webcamsPath(locale)} title={nav.allWebcams} className={iconButtonClasses}>
          <BackIcon />
        </Link>
        <Logo as="span" />
        <LanguageSwitcher className="ms-auto" />
      </Header>

      <main data-test-id="place-page" className="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6">
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: structured data has to be inline JSON; serializeJsonLd escapes "<" so values can't break out
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
        <h1 className="signage text-4xl leading-none">{fill(t.heading, { place: place.name })}</h1>
        <p className="text-firn/70 mt-4 max-w-[65ch] text-[17px] leading-relaxed">
          {introText(messages, place, locale, nearest)}{' '}
          {rich(t.cta, {
            map: (
              <Link href={mapPath(locale)} className={textLinkClasses}>
                {t.mapLink}
              </Link>
            ),
          })}
        </p>

        <ul className={`mt-8 ${webcamGridClasses}`}>
          {webcams.map((webcam) => (
            <li key={webcam.slug}>
              <WebcamCard
                href={webcamPagePath(locale, webcam.slug)}
                src={withRefreshQuery(webcam.thumbnail, refreshQuery)}
                alt={fill(index.webcamAltWithCity, { name: webcam.name, city: place.name })}
                name={webcam.name}
                detail={webcamSubtitle({ city: '', altitude: webcam.altitude }, app.webcamAltitude, locale)}
              />
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={mapWithWebcamPath(locale, centralWebcam(place).slug)}
            className="bg-sonne text-tinte signage hover:bg-firn flex h-11 items-center rounded-lg px-5 text-base transition-colors"
          >
            {fill(t.openOnMap, { place: place.name })}
          </Link>
        </div>

        {nearby.length > 0 && (
          <section className="mt-12">
            <h2 className="signage text-2xl leading-none">{fill(t.nearby, { place: place.name })}</h2>
            <ul className="mt-2 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.map((other) => (
                <li key={other.slug} className="border-firn/15 border-b">
                  <Link
                    href={placePagePath(locale, other.slug)}
                    className="group flex items-baseline justify-between gap-4 py-3"
                  >
                    <span className="signage group-hover:text-sonne truncate text-lg transition-colors">{other.name}</span>
                    <span className="text-firn/70 shrink-0 text-sm">
                      {formatDistance(w, other.distanceKm)} · {formatWebcamCount(t, other.webcams.length)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="text-firn/70 mt-10 max-w-[65ch] text-[17px] leading-relaxed">
          {rich(w.about, {
            webcams: (
              <Link href={webcamsPath(locale)} className={textLinkClasses}>
                {w.allWebcamsLink}
              </Link>
            ),
          })}
        </p>
      </main>
    </div>
  );
}
