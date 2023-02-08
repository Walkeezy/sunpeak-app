import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Header from "../components/header";
import InfoIcon from "../components/icons/info";
import Logo from "../components/logo";
import Peek from "../components/peek";
import Refresh from "../components/refresh";
import { getWebcamData, Webcam, WebcamData } from "../services/sheet";
import { generateRefreshQuery } from "../utils/generateRefreshQuery";

const DynamicMap = dynamic(() => import("../components/map"), {
  ssr: false,
});

type Props = {
  webcamData: WebcamData;
};

export default function Home({ webcamData }: Props) {
  const [data, setData] = useState<WebcamData>(webcamData);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [refreshQuery, setRefreshQuery] = useState<string>(
    generateRefreshQuery()
  );
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

  const handleReloadData = () => {
    try {
      setDataLoading(true);
      setRefreshQuery(new Date().getTime().toString());
      fetch("/api/data")
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setDataLoading(false);
        });
    } catch (error) {
      console.error(error);
      setDataLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sunpeak App</title>
      </Head>

      <div className="absolute top-0 left-0 w-full h-full flex flex-col">
        <Header>
          <Link href="/info">
            <InfoIcon />
          </Link>
          <Logo />
          <Refresh reloadData={handleReloadData} isRefreshing={dataLoading} />
        </Header>

        <main
          className={`grow ${peek ? "cursor-pointer" : ""}`}
          onClick={handleClosePeek}
        >
          <DynamicMap
            webcamData={data}
            refreshQuery={refreshQuery}
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
