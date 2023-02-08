import Head from "next/head";
import Link from "next/link";
import Header from "../components/header";
import BackIcon from "../components/icons/back";
import Logo from "../components/logo";

export default function InfoPage() {
  return (
    <>
      <Head>
        <title>Sunpeak App – Info</title>
      </Head>

      <Header>
        <Link href="/">
          <BackIcon />
        </Link>
        <Logo />
        <div></div>
      </Header>

      <main className="p-8 space-y-4">
        <p>
          This interactive map displays webcams from all over Switzerland,
          giving you a real-time glimpse of the current weather conditions and
          helping you plan your next outdoor adventure. So why wait? Let's find
          out where the sun is shining today!
        </p>
        <p>
          Contact:{" "}
          <Link
            href="mailto:mail@kevinwalker.ch"
            rel="noopener noreferrer"
            className="text-slate-700 hover:text-slate-400 transition-colors underline underline-offset-4"
          >
            mail@kevinwalker.ch
          </Link>
          .
        </p>
      </main>
    </>
  );
}