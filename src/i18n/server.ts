import { notFound } from 'next/navigation';
import { locale as localeParam } from 'next/root-params';
import { DEFAULT_LOCALE, hasLocale, type Locale } from './config';

// For pages and metadata: an unknown locale segment (e.g. /fr) is a 404
export const requireLocale = (value: string): Locale => {
  if (!hasLocale(value)) {
    notFound();
  }

  return value;
};

// For the layout and the not-found page, which must never throw notFound() themselves
export const localeOrDefault = async (): Promise<Locale> => {
  const value = await localeParam();

  return hasLocale(value) ? value : DEFAULT_LOCALE;
};
