import dynamic from "next/dynamic";
import Head from "next/head";

const DynamicMap = dynamic(() => import("../components/map"), {
  ssr: false,
});

export default function Home({}) {
  return (
    <>
      <Head>
        <title>Sunpeak App</title>
      </Head>

      <main>
        <div className="w-96 h-96">
          <DynamicMap />
        </div>
      </main>
    </>
  );
}
