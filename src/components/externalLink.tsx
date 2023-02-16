import Link from 'next/link';

type Props = {
  href: string;
  children: string;
};

export default function ExternalLink({ href, children }: Props): JSX.Element {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-700 hover:text-slate-400 transition-colors underline underline-offset-4"
    >
      {children}
    </Link>
  );
}
