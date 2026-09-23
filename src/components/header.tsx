import type { FC, PropsWithChildren } from 'react';

export const Header: FC<PropsWithChildren> = ({ children }) => (
  <header className="text-yellow bg-slate sticky top-0 grid min-h-12 grow-0 grid-cols-3 items-center gap-2 px-4 pt-[calc(env(safe-area-inset-top)+0.5rem)] pb-2 [&>:nth-child(3)]:ml-auto">
    {children}
  </header>
);
