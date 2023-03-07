import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { getTemperatureData, TemperatureData } from 'src/services/weatherData';
import Header from '../components/header';
import InfoIcon from '../components/icons/info';
import Logo from '../components/logo';
import Peek from '../components/peek';
import Refresh from '../components/refresh';
import { getWebcamData, Webcam, WebcamData } from '../services/webcamData';
import { generateRefreshQuery } from '../utils/generateRefreshQuery';

const DynamicMap = dynamic(() => import('../components/map'), {
  ssr: false,
});

type Props = {
  webcamData: WebcamData;
  temperatureData: TemperatureData;
};

export default function Home({ webcamData = [], temperatureData = [] }: Props) {
  const [camData, setCamData] = useState<WebcamData>(webcamData);
  const [tempData, setTempData] = useState<TemperatureData>(temperatureData);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [refreshQuery, setRefreshQuery] = useState<string>(generateRefreshQuery());
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
      fetch('/api/data')
        .then((res) => res.json())
        .then((data) => {
          setCamData(data.webcamData);
          setTempData(data.temperatureData);
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
          <Link href="/info" title="Go to info page">
            <InfoIcon />
          </Link>
          <Logo />
          <Refresh reloadData={handleReloadData} isRefreshing={dataLoading} />
        </Header>

        <main data-test-id="index-page" className={`grow ${peek ? 'cursor-pointer' : ''}`} onClick={handleClosePeek}>
          <DynamicMap
            webcamData={camData}
            temperatureData={tempData}
            refreshQuery={refreshQuery}
            activeWebcam={peek}
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
  const temperatureData = await getTemperatureData();
  return {
    props: {
      webcamData,
      temperatureData,
    },
    revalidate: 300, // In seconds
  };
}
