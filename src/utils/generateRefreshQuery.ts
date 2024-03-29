export const generateRefreshQuery = (): string => {
  const date = new Date();

  return `${date.getDate()}-${date.getHours()}-${Math.floor(date.getMinutes() / 15) * 15}`;
};
