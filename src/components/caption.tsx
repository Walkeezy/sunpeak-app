import { motion } from 'framer-motion';
import LinkIcon from './icons/link';

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
      transition={{ type: 'spring', duration: 0.5 }}
      className="absolute -bottom-10 left-1/2 flex -translate-x-1/2 gap-1"
    >
      <span className="whitespace-nowrap rounded bg-white px-2 py-1 text-base shadow-md">{name}</span>
      <span className="flex items-center justify-center rounded bg-white px-2 py-1 text-sm shadow-md">
        <a href={link} target="_blank" rel="noopener noreferrer">
          <LinkIcon />
        </a>
      </span>
    </motion.span>
  );
}
