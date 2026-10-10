import { describe, expect, test } from 'vitest';
import { escapeHtml } from './escapeHtml';

describe('escapeHtml', () => {
  test('escapes the characters that can break out of markup or attributes', () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe('&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
  });

  test('leaves ordinary urls alone', () => {
    expect(escapeHtml('https://example.com/cam.jpg?size=1000')).toBe('https://example.com/cam.jpg?size=1000');
  });

  test('escapes an ampersand in a query string', () => {
    expect(escapeHtml('https://example.com/cam.jpg?a=1&b=2')).toBe('https://example.com/cam.jpg?a=1&amp;b=2');
  });
});
