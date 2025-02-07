import NextLink from 'next/link';
import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
  href: string;
};

export const ExternalLink: FC<Props> = ({ href, children }) => (
  <NextLink
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-slate underline underline-offset-4 transition-opacity hover:opacity-60"
  >
    {children}
  </NextLink>
);
