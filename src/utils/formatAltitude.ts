import type { Locale } from '@/i18n/config';

const formats: Record<Locale, Intl.NumberFormat> = {
  de: new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 }),
  en: new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }),
};

// Node's ICU and some browsers use a straight apostrophe for the Swiss separator, others the typographic one
const STRAIGHT_APOSTROPHE = /'/g;

// Metres with the local thousands separator: 2’502 in German (Swiss style), 2,502 in English
export const formatAltitude = (altitude: number, locale: Locale): string =>
  formats[locale].format(altitude).replace(STRAIGHT_APOSTROPHE, '’');
