export const convertToLargeRoundshotUrl = (url: string): string => {
  if (!url.includes('roundshot')) {
    return url;
  }

  const lastSlash = url.lastIndexOf('/');
  if (lastSlash === -1 || lastSlash === url.length - 1) {
    return url;
  }

  // Only the last path segment is the image width
  return `${url.slice(0, lastSlash + 1)}1000`;
};
