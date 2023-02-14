export const convertToLargeRoundshotUrl = (url: string): string => {
  if (!url.includes("roundshot")) {
    return url;
  }

  const number = url.split("/").pop();
  return url.replace(number, "1000");
};
