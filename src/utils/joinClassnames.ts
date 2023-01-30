export const joinClassNames = (
  classNames: (string | undefined | boolean)[]
): string => classNames.filter(Boolean).join(" ");
