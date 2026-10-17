'use client';

import NextLink from 'next/link';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import { useLocale, useMessages } from '@/i18n/messages-provider';
import { infoPath, webcamsPath } from '@/utils/paths';
import { Header } from './header';
import { iconButtonClasses } from './icon-button';
import { InfoIcon } from './icons/info';
import { WebcamsIcon } from './icons/webcams';
import { LanguageSwitcher } from './language-switcher';
import { Logo } from './logo';

type Props = PropsWithChildren<{
  // Rendered in the header before the info link, e.g. the refresh button
  actions?: ReactNode;
  banner?: ReactNode;
}>;

// Page frame shared by the app and its Suspense fallback, so nothing moves when the data arrives
export const Shell: FC<Props> = ({ actions, banner, children }) => {
  const locale = useLocale();
  const { nav } = useMessages();

  return (
    <div className="absolute top-0 left-0 flex h-full w-full flex-col">
      <Header>
        <Logo />
        <div className="ms-auto flex items-center">
          {actions}
          {/* A plain link to the index, so search engines find the webcam pages from the map */}
          <NextLink href={webcamsPath(locale)} title={nav.allWebcams} className={iconButtonClasses}>
            <WebcamsIcon />
          </NextLink>
          <LanguageSwitcher />
          <NextLink href={infoPath(locale)} title={nav.info} className={iconButtonClasses}>
            <InfoIcon />
          </NextLink>
        </div>
      </Header>

      {banner}

      <main data-test-id="index-page" className="bg-nacht relative grow">
        {children}
      </main>
    </div>
  );
};
