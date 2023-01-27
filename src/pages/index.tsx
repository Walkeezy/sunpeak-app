import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import Peek from "../components/peek";
import { getWebcamData, Webcam, WebcamData } from "../services/sheet";

const DynamicMap = dynamic(() => import("../components/map"), {
  ssr: false,
});

type Props = {
  webcamData: WebcamData;
};

export default function Home({ webcamData }: Props) {
  const [peek, setPeek] = useState<Webcam | undefined>();

  const togglePeek = (cam: Webcam) => {
    if (peek?.name === cam.name) {
      setPeek(undefined);
    } else {
      setPeek(cam);
    }
  };

  const handleClosePeek = () => {
    if (peek) {
      setPeek(undefined);
    }
  };

  return (
    <>
      <Head>
        <title>Sunpeak App</title>
      </Head>

      <main>
        <div
          className={`absolute top-0 left-0 w-full h-full ${
            peek ? "cursor-pointer" : ""
          }`}
          onClick={handleClosePeek}
        >
          <DynamicMap
            webcamData={webcamData}
            togglePeek={(cam) => togglePeek(cam)}
          />

          <AnimatePresence>{peek && <Peek webcam={peek} />}</AnimatePresence>
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
