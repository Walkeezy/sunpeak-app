import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { iconButtonClasses } from '@/components/icon-button';
import { BackIcon } from '@/components/icons/back';
import { LinkIcon } from '@/components/icons/link';
import { Logo } from '@/components/logo';
import { WebcamImage } from '@/components/webcam-image';
import { settle } from '@/services/sourceResult';
import { getTemperatureData, type Temperature } from '@/services/temperatureData';
import { getWebcamData, type Webcam } from '@/services/webcamData';
import { convertToLargeRoundshotUrl } from '@/utils/convertToLargeRoundshotUrl';
import { generateRefreshQuery, withRefreshQuery } from '@/utils/generateRefreshQuery';
import { type NearestMeasurement, nearestMeasurement } from '@/utils/nearestMeasurement';
import { formatMeasurementTime } from '@/utils/temperatureLabel';
import { mapWithWebcamPath, webcamPagePath } from '@/utils/webcamUrls';

// Static and regenerated in the background. This is the ceiling: the ten-minute temperature fetch sets the actual
// pace, and every regeneration also rotates the image cache-buster
export const revalidate = 900;

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

const findWebcam = async (slug: string): Promise<Webcam> => {
  const webcam = (await getWebcamData()).find((candidate) => candidate.slug === slug);

  if (!webcam) {
    notFound();
  }

  return webcam;
};

const webcamTitle = ({ name, city }: Webcam) => (city ? `Webcam ${name}, ${city}` : `Webcam ${name}`);

const webcamDescription = ({ name, city }: Webcam) =>
  `Live view from the ${name} webcam${city ? ` in ${city}` : ''}, Switzerland, with the current temperature nearby. See where the sun is shining today on the Sunpeak map.`;

const formatDistance = (km: number) => (km < 1 ? 'less than 1 km' : `${Math.round(km)} km`);

// "Säntis, 2 km away: 4.2 °C at 10:10"
const nearestStationText = ({ measurement, distanceKm }: NearestMeasurement<Temperature>) => {
  const time = formatMeasurementTime(measurement.measuredAt);

  return `${measurement.stationName ?? 'Weather station'}, ${formatDistance(distanceKm)} away: ${measurement.value} °C${time ? ` at ${time}` : ''}`;
};

export async function generateMetadata({ params }: PageProps<'/webcams/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const webcam = await findWebcam(slug);
  const title = webcamTitle(webcam);
  const description = webcamDescription(webcam);

  return {
    title: `${title} – Sunpeak App`,
    description,
    alternates: { canonical: webcamPagePath(slug) },
    openGraph: {
      title,
      description,
      url: webcamPagePath(slug),
      siteName: 'Sunpeak',
      images: [{ url: webcam.fullsize, alt: title }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

export default async function WebcamPage({ params }: PageProps<'/webcams/[slug]'>) {
  const { slug } = await params;
  const [webcam, temperatures] = await Promise.all([findWebcam(slug), settle(getTemperatureData(), [])]);
  const refreshQuery = generateRefreshQuery();
  const nearest = nearestMeasurement(temperatures.data, webcam.latitude, webcam.longitude);
  const title = webcamTitle(webcam);

  return (
    <div className="bg-nacht text-firn flex min-h-dvh flex-col">
      <Header>
        <Link href="/webcams" title="All webcams" className={iconButtonClasses}>
          <BackIcon />
        </Link>
        <Logo as="span" />
      </Header>

      <main data-test-id="webcam-page" className="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6">
        <h1 className="signage text-4xl leading-none">{webcam.name}</h1>
        {webcam.city && <p className="text-firn/70 signage mt-2 text-xl">{webcam.city}</p>}

        <figure className="mt-6">
          <WebcamImage
            src={withRefreshQuery(webcam.fullsize, refreshQuery)}
            largeSrc={withRefreshQuery(convertToLargeRoundshotUrl(webcam.fullsize), refreshQuery)}
            alt={title}
            panorama={webcam.panorama}
          />
          <figcaption className="text-firn/70 mt-3 text-sm">
            Live picture, refreshed every few minutes.
            {nearest && <> Nearest weather station: {nearestStationText(nearest)}.</>}
          </figcaption>
        </figure>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={mapWithWebcamPath(slug)}
            className="bg-sonne text-tinte signage hover:bg-firn flex h-11 items-center rounded-lg px-5 text-base transition-colors"
          >
            Open on the map
          </Link>
          <a
            href={webcam.link}
            target="_blank"
            rel="noopener noreferrer"
            className="border-firn/30 signage hover:border-firn flex h-11 items-center gap-2 rounded-lg border px-5 text-base transition-colors"
          >
            Webcam website
            <LinkIcon />
          </a>
        </div>

        <p className="text-firn/70 mt-10 max-w-[65ch] text-[17px] leading-relaxed">
          {webcamDescription(webcam)} Temperature and wind are the latest ten-minute measurements from MeteoSwiss. Browse{' '}
          <Link href="/webcams" className="decoration-sonne font-medium underline decoration-2 underline-offset-4">
            all webcams
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
