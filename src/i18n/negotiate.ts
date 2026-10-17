import { hasLocale, type Locale } from './config';

// Picks the best supported locale from an Accept-Language header, e.g. "de-CH,de;q=0.9,en;q=0.8".
// Only the primary subtag counts, so de-CH, de-DE and de all mean German
export const negotiateLocale = (acceptLanguage: string | null | undefined): Locale | undefined => {
  if (!acceptLanguage) {
    return undefined;
  }

  const ranked = acceptLanguage
    .split(',')
    .map((entry, index) => {
      const [tag = '', ...parameters] = entry.trim().split(';');
      const quality = parameters.map((parameter) => parameter.trim()).find((parameter) => parameter.startsWith('q='));
      const q = quality ? Number(quality.slice(2)) : 1;

      return { language: tag.trim().toLowerCase().split('-')[0], q: Number.isFinite(q) ? q : 0, index };
    })
    .filter(({ q }) => q > 0)
    // Higher quality first; equal qualities keep the order the browser sent
    .sort((a, b) => b.q - a.q || a.index - b.index);

  return ranked.map(({ language }) => language).find(hasLocale);
};
