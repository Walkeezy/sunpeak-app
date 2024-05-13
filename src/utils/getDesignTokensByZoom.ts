export const DefaultDesignTokens = {
  camSize: 40,
  arrowSize: 6,
  borderRadius: 'rounded-xl',
};

export type DesignTokens = {
  camSize: number;
  arrowSize: number;
  borderRadius: string;
};

const getSize = (zoom: number): number => {
  if (zoom <= 9) {
    return 30;
  } else if (zoom <= 10) {
    return 40;
  } else if (zoom <= 11) {
    return 50;
  } else if (zoom <= 12) {
    return 60;
  }

  return 70;
};

const getArrowSize = (zoom: number): number => {
  if (zoom <= 9) {
    return 4;
  } else if (zoom <= 10) {
    return 6;
  } else if (zoom <= 11) {
    return 8;
  }

  return 10;
};

const getBorderRadius = (zoom: number): string => {
  if (zoom <= 9) {
    return 'rounded-lg';
  }

  return 'rounded-xl';
};

export const getDesignTokensByZoom = (zoom: number): DesignTokens => {
  return {
    camSize: getSize(zoom),
    arrowSize: getArrowSize(zoom),
    borderRadius: getBorderRadius(zoom),
  };
};
