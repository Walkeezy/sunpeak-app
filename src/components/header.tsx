import type { FC, PropsWithChildren } from 'react';

export const Header: FC<PropsWithChildren> = ({ children }) => (
  <header className="bg-schiefer text-sonne sticky top-0 flex min-h-14 shrink-0 items-center gap-1 px-2 pt-[calc(env(safe-area-inset-top)+0.25rem)] pb-1">
    {children}
  </header>
);
