'use client';

import { FC, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { ArrowIcon } from './icons/arrow';
import { LoadingIcon } from './icons/loading';

type Props = {
  location?: [number, number];
  setLocation: (location: [number, number]) => void;
};

export const Locator: FC<Props> = ({ location, setLocation }) => {
  const map = useMap();
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);

  const locateUser = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setLoadingLocation(false);
      },
      (error) => {
        setLoadingLocation(false);
        console.error(error.message);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
    );
  };

  useEffect(() => {
    if (location) {
      map.flyTo(location, map.getZoom());
    }
  }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button
      title="Locate me"
      onClick={locateUser}
      className="flex size-11 items-center justify-center rounded-[5px] border-2 border-[rgba(0,0,0,0.2)] bg-white"
    >
      {loadingLocation ? <LoadingIcon color="#666" /> : <ArrowIcon />}
    </button>
  );
};
