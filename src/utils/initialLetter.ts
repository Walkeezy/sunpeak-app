const combiningMarks = /[̀-ͯ]/g;

export const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

// The plain capital a name sorts under: "Anzère" → A, "Üetliberg" → U, "St. Moritz" → S; empty when it starts with
// something that isn't a letter
export const initialLetter = (name: string): string => {
  const letter = name.trim().normalize('NFD').replace(combiningMarks, '').charAt(0).toUpperCase();

  return ALPHABET.includes(letter) ? letter : '';
};

// For each letter, the first of the (sorted) names that starts with it
export const firstByLetter = <T>(items: T[], name: (item: T) => string): Map<string, T> => {
  const first = new Map<string, T>();

  for (const item of items) {
    const letter = initialLetter(name(item));

    if (letter && !first.has(letter)) {
      first.set(letter, item);
    }
  }

  return first;
};
