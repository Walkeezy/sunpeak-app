import { motion } from 'framer-motion';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj.js';
import { useMemo, useState } from 'react';
import { RFeature, ROverlay } from 'rlayers';
import { Webcam } from '../services/webcamData';
import { DesignTokens } from '../utils/getDesignTokensByZoom';
import { joinClasses } from '../utils/joinClasses';
import LoadingIcon from './icons/loading';

type Props = {
  webcam: Webcam;
  isActive: boolean;
  refreshQuery: string;
  designTokens: DesignTokens;
  togglePeek: () => void;
};

export default function Cam({ webcam, isActive, refreshQuery, designTokens, togglePeek }: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const { camSize, borderRadius, arrowSize } = designTokens;

  const getPoint = useMemo(
    () => new Point(fromLonLat([webcam.longitude, webcam.latitude])),
    [webcam.longitude, webcam.latitude],
  );

  return (
    <RFeature geometry={getPoint}>
      <ROverlay className="relative">
        <motion.div
          data-test-id="cam-thumbnail"
          layoutId={`${webcam.name}-${webcam.city}`}
          transition={{ type: 'spring', bounce: 0.1, duration: 0.5 }}
          initial={false}
          onClick={togglePeek}
          className={joinClasses([
            'user-select-none relative z-10 mt-1 cursor-pointer overflow-hidden border-2 border-white bg-slate-700 shadow-md',
            borderRadius,
          ])}
          style={{
            width: `${camSize}px`,
            height: `${camSize}px`,
            marginLeft: `-${camSize / 2}px`,
          }}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingIcon />
            </div>
          )}
          <picture>
            <img
              src={webcam.thumbnail + '?' + refreshQuery}
              width={camSize}
              height={camSize}
              className={joinClasses(['h-full w-full object-cover', loading && 'opacity-0'])}
              loading="lazy"
              onLoad={() => setLoading(false)}
              alt={webcam.name}
            />
          </picture>
        </motion.div>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute z-0 rotate-45 bg-white"
            style={{
              top: `-${arrowSize / 2}px`,
              left: `-${arrowSize / 2}px`,
              width: `${arrowSize}px`,
              height: `${arrowSize}px`,
            }}
          ></motion.div>
        )}
      </ROverlay>
    </RFeature>
  );
}
