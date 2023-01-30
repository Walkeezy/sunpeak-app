import { motion } from "framer-motion";
import { Webcam } from "../services/sheet";

type Props = {
  webcam: Webcam;
};

export default function Peek({ webcam }: Props): JSX.Element {
  const imgUrl = webcam.forceReload
    ? webcam.fullsize + "?" + Date.now()
    : webcam.fullsize;
  return (
    <motion.div
      layoutId={webcam.name}
      className={`flex justify-center fixed border-[3px] border-white bg-white rounded-xl shadow-2xl ${
        webcam.panorama ? "animate-move-background-faster" : ""
      }`}
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        width: "95vw",
        height: "40vh",
        top: "28vh",
        left: "2.5vw",
      }}
    >
      <span className="absolute -bottom-9 bg-white px-2 py-1 rounded text-sm shadow-md">
        {webcam.name}
      </span>
    </motion.div>
  );
}
