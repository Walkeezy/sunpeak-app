import dynamic from "next/dynamic";
import Head from "next/head";
import { getWebcamData, WebcamData } from "../services/sheet";

const DynamicMap = dynamic(() => import("../components/map"), {
  ssr: false,
});

type Props = {
  webcamData: WebcamData;
};

export default function Home({ webcamData }: Props) {
  return (
    <>
      <Head>
        <title>Sunpeak App</title>
      </Head>

      <main>
        <div className="absolute top-0 left-0 w-full h-full">
          <DynamicMap webcamData={webcamData} />
        </div>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const webcamData = await getWebcamData();
  return {
    props: {
      webcamData,
    },
    revalidate: 300, // In seconds
  };
}
