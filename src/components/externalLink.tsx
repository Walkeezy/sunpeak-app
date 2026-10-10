import NextLink from 'next/link';
import type { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  href: string;
};

export const ExternalLink: FC<Props> = ({ href, children }) => (
  <NextLink
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="decoration-sonne hover:decoration-tinte font-medium underline decoration-2 underline-offset-4 transition-colors"
  >
    {children}
  </NextLink>
);
