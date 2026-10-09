export const generateRefreshQuery = (): string => {
  const date = new Date();

  return `${date.getDate()}-${date.getHours()}-${Math.floor(date.getMinutes() / 15) * 15}`;
};

export const withRefreshQuery = (url: string, refreshQuery: string): string =>
  `${url}${url.includes('?') ? '&' : '?'}${refreshQuery}`;
