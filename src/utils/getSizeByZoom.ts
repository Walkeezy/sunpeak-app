export const getSizeByZoom = (zoom: number): number => {
  if (zoom <= 9) {
    return 30;
  } else if (zoom <= 10) {
    return 40;
  } else if (zoom <= 11) {
    return 50;
  } else if (zoom <= 12) {
    return 60;
  } else if (zoom > 12) {
    return 70;
  }
};
