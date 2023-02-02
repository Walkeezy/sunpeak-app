import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import Logo from "../components/icons/logo";
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

      <div className="absolute top-0 left-0 w-full h-full flex flex-col">
        <header className="grow-0 h-12 bg-slate-700 text-sunpeak-yellow flex items-center justify-center gap-2 justify-items-stretch">
          <Logo />
          <h1>Sunpeak</h1>
        </header>

        <main
          className={`grow ${peek ? "cursor-pointer" : ""}`}
          onClick={handleClosePeek}
        >
          <DynamicMap
            webcamData={webcamData}
            togglePeek={(cam) => togglePeek(cam)}
          />

          <AnimatePresence>{peek && <Peek webcam={peek} />}</AnimatePresence>
        </main>
      </div>
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
