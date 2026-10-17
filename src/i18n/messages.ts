import { de } from '@/messages/de';
import { en } from '@/messages/en';
import type { ClientMessages, Messages } from '@/messages/types';
import type { Locale } from './config';

const dictionaries: Record<Locale, Messages> = { de, en };

export const getMessages = (locale: Locale): Messages => dictionaries[locale];

// Only what client components need goes into the RSC payload
export const clientMessages = ({ nav, app, station }: Messages): ClientMessages => ({ nav, app, station });
