import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { iconButtonClasses } from '@/components/icon-button';
import { BackIcon } from '@/components/icons/back';
import { Logo } from '@/components/logo';
import { WebcamThumbnail } from '@/components/webcam-image';
import { settle } from '@/services/sourceResult';
import { getWebcamData } from '@/services/webcamData';
import { generateRefreshQuery, withRefreshQuery } from '@/utils/generateRefreshQuery';
import { webcamPagePath } from '@/utils/webcamUrls';

// Static, regenerated hourly like the webcam list itself
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'All webcams – Sunpeak App',
  description:
    'Every live webcam on the Sunpeak map, from the Alps to the Jura. Open one for the full picture, the current temperature nearby and its spot on the map.',
  alternates: { canonical: '/webcams' },
};

export default async function WebcamsPage() {
  const { data: webcams, ok } = await settle(getWebcamData(), []);
  const refreshQuery = generateRefreshQuery();
  const sorted = webcams.toSorted((a, b) => a.name.localeCompare(b.name, 'de-CH'));

  return (
    <div className="bg-nacht text-firn flex min-h-dvh flex-col">
      <Header>
        <Link href="/" title="Go back to the map" className={iconButtonClasses}>
          <BackIcon />
        </Link>
        <Logo as="span" />
      </Header>

      <main data-test-id="webcams-page" className="mx-auto w-full max-w-6xl px-4 pt-8 pb-16 sm:px-6">
        <h1 className="signage text-4xl leading-none">All webcams</h1>
        <p className="text-firn/70 mt-4 max-w-[65ch] text-[17px] leading-relaxed">
          Live pictures from all over Switzerland, refreshed every few minutes. Open a webcam for the full picture, the
          temperature nearby and its spot on the{' '}
          <Link href="/" className="decoration-sonne font-medium underline decoration-2 underline-offset-4">
            map
          </Link>
          .
        </p>

        {ok ? (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {sorted.map((webcam) => (
              <li key={webcam.slug}>
                <Link href={webcamPagePath(webcam.slug)} className="group block rounded-lg">
                  <WebcamThumbnail
                    src={withRefreshQuery(webcam.thumbnail, refreshQuery)}
                    alt={webcam.city ? `Webcam ${webcam.name}, ${webcam.city}` : `Webcam ${webcam.name}`}
                  />
                  <span className="signage group-hover:text-sonne mt-2 block truncate text-base leading-tight transition-colors">
                    {webcam.name}
                  </span>
                  {webcam.city && <span className="text-firn/70 block truncate text-sm">{webcam.city}</span>}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p role="alert" className="bg-sonne text-tinte signage mt-8 rounded-lg px-4 py-3 text-sm">
            The webcam list could not be loaded. Please try again later.
          </p>
        )}
      </main>
    </div>
  );
}
