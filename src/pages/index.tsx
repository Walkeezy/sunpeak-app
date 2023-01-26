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
        <div className="absolute top-0 left-0 w-full h-full">
          <DynamicMap />
        </div>
      </main>
    </>
  );
}
