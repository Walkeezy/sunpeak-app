import { notFound } from 'next/navigation';

// Unknown paths below a locale, e.g. /de/gibts-nicht, get the localized 404 page with a 404 status
export default function CatchAll() {
  notFound();
}
