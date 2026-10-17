import NextLink from 'next/link';
import type { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  href: string;
};

// Shared by external links and in-app text links on the reading pages
export const textLinkClasses =
  'decoration-sonne hover:decoration-current font-medium underline decoration-2 underline-offset-4 transition-colors';

export const ExternalLink: FC<Props> = ({ href, children }) => (
  <NextLink href={href} target="_blank" rel="noopener noreferrer" className={textLinkClasses}>
    {children}
  </NextLink>
);
