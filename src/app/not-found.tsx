import type { Metadata } from 'next';
import Link from 'next/link';
import { textLinkClasses } from '@/components/externalLink';
import { Header } from '@/components/header';
import { iconButtonClasses } from '@/components/icon-button';
import { BackIcon } from '@/components/icons/back';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
  title: 'Page not found – Sunpeak App',
};

export default function NotFound() {
  return (
    <div className="on-light bg-firn text-tinte flex min-h-dvh flex-col">
      <Header>
        <Link href="/" title="Go back to home page" className={iconButtonClasses}>
          <BackIcon />
        </Link>
        <Logo as="span" />
      </Header>

      <main className="mx-auto w-full max-w-[65ch] px-6 pt-10 pb-16 text-[17px] leading-relaxed">
        <h1 className="signage text-4xl leading-none">Page not found</h1>
        <p className="mt-5">This page doesn't exist, or the webcam has been taken off the map.</p>
        <p className="mt-5">
          <Link href="/" className={textLinkClasses}>
            Back to the map
          </Link>{' '}
          or browse{' '}
          <Link href="/webcams" className={textLinkClasses}>
            all webcams
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
