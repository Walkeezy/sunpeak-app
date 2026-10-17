'use client';

import NextLink from 'next/link';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import { useLocale, useMessages } from '@/i18n/messages-provider';
import { joinClasses } from '@/utils/joinClasses';
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
  // Floats over the top of the map
  banner?: ReactNode;
}>;

// Page frame of the map: the header, the toast slot over the map and the map itself
export const Shell: FC<Props> = ({ actions, banner, children }) => {
  const locale = useLocale();
  const { nav } = useMessages();

  return (
    <div className="absolute top-0 left-0 flex h-full w-full flex-col">
      <Header>
        <Logo />
        <div className="ms-auto flex items-center">
          {actions}
          {/* A plain link to the index, so search engines find the webcam pages from the map. On phones the
              search panel carries the link, so the header keeps room for the freshness chip */}
          <NextLink
            href={webcamsPath(locale)}
            title={nav.allWebcams}
            aria-label={nav.allWebcams}
            className={joinClasses([iconButtonClasses, 'hidden sm:flex'])}
          >
            <WebcamsIcon />
          </NextLink>
          <LanguageSwitcher />
          <NextLink href={infoPath(locale)} title={nav.info} aria-label={nav.info} className={iconButtonClasses}>
            <InfoIcon />
          </NextLink>
        </div>
      </Header>

      <main data-test-id="index-page" className="bg-nacht relative grow">
        {children}
        {banner && <div className="pointer-events-none absolute inset-x-3 top-3 z-[1050] flex justify-center">{banner}</div>}
      </main>
    </div>
  );
};
