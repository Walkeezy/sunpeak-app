import { FC, PropsWithChildren } from 'react';

export const Header: FC<PropsWithChildren> = ({ children }) => (
  <header className="align-items-center relative grid h-12 grow-0 grid-cols-3 items-center gap-2 bg-slate-700 px-4 py-2 text-sunpeak-yellow [&>:nth-child(3)]:ml-auto">
    {children}
  </header>
);
