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
    className="text-slate-700 underline underline-offset-4 transition-colors hover:text-slate-400"
  >
    {children}
  </NextLink>
);
