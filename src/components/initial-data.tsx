'use client';

import { type FC, use, useEffect } from 'react';
import type { SourceData } from '@/services/sourceData';

type Props = {
  sources: Promise<SourceData>;
  onLoaded: (data: SourceData) => void;
};

// Suspends on its own until the sources are loaded, so the map around it shows its tiles meanwhile.
// Renders nothing: the data reaches the app's state through onLoaded
export const InitialData: FC<Props> = ({ sources, onLoaded }) => {
  const data = use(sources);

  useEffect(() => {
    onLoaded(data);
  }, [data, onLoaded]);

  return null;
};
