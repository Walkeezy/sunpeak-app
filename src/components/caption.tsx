import { motion } from "framer-motion";
import LinkIcon from "./icons/link";

type Props = {
  name: string;
  link: string;
};

export default function Caption({ name, link }: Props): JSX.Element {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-1"
    >
      <span className="bg-white px-2 py-1 rounded text-base shadow-md whitespace-nowrap">
        {name}
      </span>
      <span className="bg-white px-2 py-1 rounded text-sm shadow-md flex justify-center items-center">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <LinkIcon />
        </a>
      </span>
    </motion.span>
  );
}
