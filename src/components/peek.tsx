import { motion } from "framer-motion";
import { Webcam } from "../services/sheet";
import { joinClassNames } from "../utils/joinClassnames";

type Props = {
  webcam: Webcam;
};

export default function Peek({ webcam }: Props): JSX.Element {
  const imgUrl = webcam.forceReload
    ? webcam.fullsize + "?" + Date.now()
    : webcam.fullsize;
  const peekWidth = webcam.panorama ? "w-[95vw]" : "w-[95vw] max-w-[1000px]";

  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center">
      <motion.div
        layoutId={webcam.name}
        className={joinClassNames([
          "border-[3px] border-white bg-white rounded-xl shadow-2xl",
          peekWidth,
          "h-[40vh] overflow-x-auto overflow-y-auto",
        ])}
      >
        <img
          src={imgUrl}
          className="lg:object-cover w-auto h-full max-w-none"
        />
        <span className="absolute -bottom-9 bg-white px-2 py-1 rounded text-sm shadow-md">
          {webcam.name}
        </span>
      </motion.div>
    </div>
  );
}
