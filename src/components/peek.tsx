import { motion } from "framer-motion";
import { Webcam } from "../services/sheet";
import { joinClassNames } from "../utils/joinClassnames";
import Caption from "./caption";

type Props = {
  webcam: Webcam;
};

export default function Peek({ webcam }: Props): JSX.Element {
  const imgUrl = webcam.forceReload
    ? webcam.fullsize + "?" + Date.now()
    : webcam.fullsize;

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <motion.div
        layoutId={webcam.name}
        className="relative border-[3px] border-white bg-white rounded-xl shadow-2xl"
      >
        <div
          className={joinClassNames([
            "w-[95vw] h-[40vh] lg:h-[80vh] overflow-auto rounded-xl",
            !webcam.panorama && "max-w-[1000px]",
          ])}
        >
          <img src={imgUrl} className="w-auto h-full max-w-none" />
        </div>
        <Caption name={webcam.name} link={webcam.link} />
      </motion.div>
    </div>
  );
}
