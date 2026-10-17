import { createElement, Fragment, type ReactNode } from 'react';
import type { Locale } from './config';

const PLACEHOLDER = /\{(\w+)\}/g;
const PLACEHOLDER_PART = /(\{\w+\})/;
const PLACEHOLDER_NAME = /^\{(\w+)\}$/;

// Fills {name} placeholders in a message; unknown placeholders stay visible so a missing value is easy to spot
export const fill = (template: string, values: Record<string, string | number>): string =>
  template.replace(PLACEHOLDER, (match, name: string) => (name in values ? String(values[name]) : match));

// Like fill, but the values are React nodes, e.g. a link inside a sentence
export const rich = (template: string, values: Record<string, ReactNode>): ReactNode[] =>
  template.split(PLACEHOLDER_PART).map((part, index) => {
    const name = PLACEHOLDER_NAME.exec(part)?.[1];

    return name !== undefined && name in values ? createElement(Fragment, { key: `${name}-${index}` }, values[name]) : part;
  });

// Placeholder names used in a message, to check that translations agree
export const placeholders = (template: string): string[] =>
  [...template.matchAll(PLACEHOLDER)].map(([, name]) => name).toSorted();

const COLLATOR_LOCALES: Record<Locale, string> = { de: 'de-CH', en: 'en-GB' };

// For sorting names the way the language expects, e.g. ä next to a
export const collator = (locale: Locale): Intl.Collator => new Intl.Collator(COLLATOR_LOCALES[locale]);
