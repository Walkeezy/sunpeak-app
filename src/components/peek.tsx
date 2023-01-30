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

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <motion.div
        layoutId={webcam.name}
        className="relative border-[3px] border-white bg-white rounded-xl shadow-2xl"
      >
        <div className="rounded-xl overflow-hidden">
          <div
            className={joinClassNames([
              "w-[95vw] h-[40vh] lg:h-[80vh] overflow-auto",
              !webcam.panorama && "max-w-[1000px]",
            ])}
          >
            <img src={imgUrl} className="w-auto h-full max-w-none" />
          </div>
        </div>
        <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-1">
          <span className="bg-white px-2 py-1 rounded-xl text-sm shadow-md whitespace-nowrap">
            {webcam.name}
          </span>
          <span className="bg-white px-2 py-1 rounded text-sm shadow-md flex justify-center items-center">
            <a href={webcam.link} target="_blank" rel="noopener noreferrer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18px"
                height="18px"
              >
                <path d="M 19.980469 2.9902344 A 1.0001 1.0001 0 0 0 19.869141 3 L 15 3 A 1.0001 1.0001 0 1 0 15 5 L 17.585938 5 L 8.2929688 14.292969 A 1.0001 1.0001 0 1 0 9.7070312 15.707031 L 19 6.4140625 L 19 9 A 1.0001 1.0001 0 1 0 21 9 L 21 4.1269531 A 1.0001 1.0001 0 0 0 19.980469 2.9902344 z M 5 3 C 3.9069372 3 3 3.9069372 3 5 L 3 19 C 3 20.093063 3.9069372 21 5 21 L 19 21 C 20.093063 21 21 20.093063 21 19 L 21 13 A 1.0001 1.0001 0 1 0 19 13 L 19 19 L 5 19 L 5 5 L 11 5 A 1.0001 1.0001 0 1 0 11 3 L 5 3 z" />
              </svg>
            </a>
          </span>
        </span>
      </motion.div>
    </div>
  );
}
