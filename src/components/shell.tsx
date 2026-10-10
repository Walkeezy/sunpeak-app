import NextLink from 'next/link';
import type { FC, PropsWithChildren, ReactNode } from 'react';
import { Header } from './header';
import { iconButtonClasses } from './icon-button';
import { InfoIcon } from './icons/info';
import { Logo } from './logo';

type Props = PropsWithChildren<{
  // Rendered in the header before the info link, e.g. the refresh button
  actions?: ReactNode;
  banner?: ReactNode;
}>;

// Page frame shared by the app and its Suspense fallback, so nothing moves when the data arrives
export const Shell: FC<Props> = ({ actions, banner, children }) => (
  <div className="absolute top-0 left-0 flex h-full w-full flex-col">
    <Header>
      <Logo />
      <div className="ms-auto flex items-center">
        {actions}
        <NextLink href="/info" title="Go to info page" className={iconButtonClasses}>
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
