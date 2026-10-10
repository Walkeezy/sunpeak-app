const replacements: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const specialCharacters = /[&<>"']/g;

// For values interpolated into markup strings, such as the Leaflet DivIcon html
export const escapeHtml = (value: string): string =>
  value.replace(specialCharacters, (character) => replacements[character] ?? character);
