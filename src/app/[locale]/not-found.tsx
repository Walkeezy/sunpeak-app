import type { Metadata } from 'next';
import Link from 'next/link';
import { textLinkClasses } from '@/components/externalLink';
import { Header } from '@/components/header';
import { iconButtonClasses } from '@/components/icon-button';
import { BackIcon } from '@/components/icons/back';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';
import { rich } from '@/i18n/format';
import { getMessages } from '@/i18n/messages';
import { localeOrDefault } from '@/i18n/server';
import { mapPath, webcamsPath } from '@/utils/paths';

export async function generateMetadata(): Promise<Metadata> {
  return { title: getMessages(await localeOrDefault()).meta.notFoundTitle };
}

export default async function NotFound() {
  const locale = await localeOrDefault();
  const { nav, notFound } = getMessages(locale);

  return (
    <div className="on-light bg-firn text-tinte flex min-h-dvh flex-col">
      <Header>
        <Link href={mapPath(locale)} title={nav.backToMap} className={iconButtonClasses}>
          <BackIcon />
        </Link>
        <Logo as="span" />
        <LanguageSwitcher className="ms-auto" />
      </Header>

      <main className="mx-auto w-full max-w-[65ch] px-6 pt-10 pb-16 text-[17px] leading-relaxed">
        <h1 className="signage text-4xl leading-none">{notFound.heading}</h1>
        <p className="mt-5">{notFound.text}</p>
        <p className="mt-5">
          {rich(notFound.links, {
            map: (
              <Link href={mapPath(locale)} className={textLinkClasses}>
                {notFound.mapLink}
              </Link>
            ),
            webcams: (
              <Link href={webcamsPath(locale)} className={textLinkClasses}>
                {notFound.webcamsLink}
              </Link>
            ),
          })}
        </p>
      </main>
    </div>
  );
}
