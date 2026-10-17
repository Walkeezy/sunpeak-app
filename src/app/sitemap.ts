import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config';
import { settle } from '@/services/sourceResult';
import { getWebcamData } from '@/services/webcamData';
import { webcamPagePath } from '@/utils/webcamUrls';

// Regenerated hourly like the webcam list; falls back to the static pages when the list can't be loaded
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: webcams } = await settle(getWebcamData(), []);

  return [
    { url: SITE_URL, changeFrequency: 'always', priority: 1 },
    { url: `${SITE_URL}/webcams`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/info`, changeFrequency: 'yearly', priority: 0.3 },
    ...webcams.map(({ slug, fullsize }) => ({
      url: `${SITE_URL}${webcamPagePath(slug)}`,
      changeFrequency: 'hourly' as const,
      priority: 0.7,
      images: [fullsize],
    })),
  ];
}
