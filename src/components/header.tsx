type Props = {
  children: React.ReactNode;
};

export default function Header({ children }: Props): JSX.Element {
  return (
    <header className="align-items-center relative grid h-12 grow-0 grid-cols-3 items-center gap-2 bg-slate-700 px-4 py-2 text-sunpeak-yellow [&>:nth-child(3)]:ml-auto">
      {children}
    </header>
  );
}
