type Props = {
  children: React.ReactNode;
};

export default function Header({ children }: Props): JSX.Element {
  return (
    <header className="relative grow-0 h-12 grid grid-cols-3 align-items-center items-center [&>:nth-child(3)]:ml-auto gap-2 px-4 py-2 bg-slate-700 text-sunpeak-yellow">
      {children}
    </header>
  );
}
