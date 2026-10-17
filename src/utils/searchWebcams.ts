import type { Webcam } from '@/services/webcamData';
import type { Place } from './places';

export type SearchResult = { kind: 'place'; place: Place } | { kind: 'webcam'; webcam: Webcam };

export const MAX_SEARCH_RESULTS = 8;

const combiningMarks = /[̀-ͯ]/g;

// Lowercase without accents, so "zurich" finds Zürich and "Sankt" is typed as it is spoken
const fold = (value: string): string => value.toLowerCase().normalize('NFD').replace(combiningMarks, '');

// 0 at the start of the name, 1 at the start of a later word, 2 anywhere else; undefined when it doesn't match
const rank = (text: string, needle: string): number | undefined => {
  const haystack = fold(text);

  if (haystack.startsWith(needle)) {
    return 0;
  }

  if (haystack.includes(` ${needle}`) || haystack.includes(`-${needle}`) || haystack.includes(`(${needle}`)) {
    return 1;
  }

  return haystack.includes(needle) ? 2 : undefined;
};

type Scored = { score: number; name: string; result: SearchResult };

// Places and webcams whose names match the query, best matches first. Places come before webcams at the same
// rank, since one place stands for all its webcams; webcams match by name only, their town is the place
export const searchWebcams = (query: string, webcams: Webcam[], places: Place[]): SearchResult[] => {
  const needle = fold(query.trim());

  if (!needle) {
    return [];
  }

  const scored: Scored[] = [];

  for (const place of places) {
    const score = rank(place.name, needle);

    if (score !== undefined) {
      scored.push({ score: score * 2, name: place.name, result: { kind: 'place', place } });
    }
  }

  for (const webcam of webcams) {
    const score = rank(webcam.name, needle);

    if (score !== undefined) {
      scored.push({ score: score * 2 + 1, name: webcam.name, result: { kind: 'webcam', webcam } });
    }
  }

  return scored
    .toSorted((a, b) => a.score - b.score || a.name.localeCompare(b.name))
    .slice(0, MAX_SEARCH_RESULTS)
    .map(({ result }) => result);
};
