import NextLink from 'next/link';

type Props = {
  href: string;
  children: string;
};

export default function ExternalLink({ href, children }: Props): JSX.Element {
  return (
    <NextLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-700 underline underline-offset-4 transition-colors hover:text-slate-400"
    >
      {children}
    </NextLink>
  );
}
