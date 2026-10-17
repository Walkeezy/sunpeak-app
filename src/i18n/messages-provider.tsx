'use client';

import { createContext, type FC, type PropsWithChildren, use, useMemo } from 'react';
import type { ClientMessages } from '@/messages/types';
import type { Locale } from './config';

type Value = { locale: Locale; messages: ClientMessages };

const MessagesContext = createContext<Value | null>(null);

type Props = PropsWithChildren<Value>;

// Set once by the locale layout; the value only changes with the locale, so memoized consumers stay put
export const MessagesProvider: FC<Props> = ({ locale, messages, children }) => {
  const value = useMemo(() => ({ locale, messages }), [locale, messages]);

  return <MessagesContext value={value}>{children}</MessagesContext>;
};

const useMessagesContext = (): Value => {
  const value = use(MessagesContext);

  if (!value) {
    throw new Error('useMessages and useLocale need a MessagesProvider above them');
  }

  return value;
};

export const useMessages = (): ClientMessages => useMessagesContext().messages;

export const useLocale = (): Locale => useMessagesContext().locale;
