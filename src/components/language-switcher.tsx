'use client';

import { usePathname } from 'next/navigation';
import type { FC, MouseEvent } from 'react';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/config';
import { useLocale, useMessages } from '@/i18n/messages-provider';
import { joinClasses } from '@/utils/joinClasses';
import { switchLocalePath } from '@/utils/paths';
import { saveLocaleToCookie } from '@/utils/preferenceCookie';
import { iconButtonClasses } from './icon-button';

type Props = {
  className?: string;
};

// Links to the same page in the other language and remembers the choice for unprefixed URLs such as /
export const LanguageSwitcher: FC<Props> = ({ className }) => {
  const pathname = usePathname();
  const locale = useLocale();
  const { nav } = useMessages();
  const target = LOCALES.find((candidate) => candidate !== locale) ?? DEFAULT_LOCALE;
  const href = switchLocalePath(pathname, target);

  // A plain link, so the page loads fully: the html lang attribute and the server-rendered texts change with
  // the locale. Search params such as ?cam= are carried over on a normal click; modified clicks (new tab) keep
  // their default behaviour
  const switchLanguage = (event: MouseEvent<HTMLAnchorElement>) => {
    saveLocaleToCookie(target);

    const isPlainClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

    if (isPlainClick && window.location.search) {
      event.preventDefault();
      window.location.assign(`${href}${window.location.search}`);
    }
  };

  return (
    <a
      href={href}
      hrefLang={target}
      lang={target}
      title={nav.otherLanguage}
      aria-label={nav.otherLanguage}
      onClick={switchLanguage}
      className={joinClasses([iconButtonClasses, 'signage text-sm uppercase', className])}
    >
      {target}
    </a>
  );
};
