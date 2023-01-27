import { motion, MotionConfig } from "framer-motion";
import { Webcam } from "../services/sheet";

type Props = {
  webcam: Webcam;
  closePeek: () => void;
};

export default function Peek({ webcam, closePeek }: Props): JSX.Element {
  return (
    <motion.div
      layoutId={webcam.name}
      className={`flex justify-center fixed border-[3px] border-white rounded-xl shadow-2xl ${
        webcam.panorama ? "animate-move-background-faster" : ""
      }`}
      onClick={closePeek}
      style={{
        backgroundImage: `url(${webcam.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
