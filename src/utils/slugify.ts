// German umlauts are transliterated the Swiss way (ä → ae); other accents are stripped
const transliterations: Record<string, string> = {
  ä: 'ae',
  ö: 'oe',
  ü: 'ue',
  ß: 'ss',
  æ: 'ae',
  ø: 'oe',
  å: 'aa',
};

const umlauts = /[äöüßæøå]/g;
const combiningMarks = /[̀-ͯ]/g;
const nonAlphanumeric = /[^a-z0-9]+/g;
const edgeDashes = /^-+|-+$/g;

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(umlauts, (character) => transliterations[character] ?? character)
    .normalize('NFD')
    .replace(combiningMarks, '')
    .replace(nonAlphanumeric, '-')
    .replace(edgeDashes, '');

// Numbers duplicates (foo, foo-2, foo-3) so every slug is unique; the order of the input decides who keeps the plain one
export const uniqueSlugs = (values: string[]): string[] => {
  const seen = new Map<string, number>();

  return values.map((value) => {
    const base = slugify(value) || 'webcam';
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);

    return count === 1 ? base : `${base}-${count}`;
  });
};
