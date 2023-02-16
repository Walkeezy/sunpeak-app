export const joinClasses = (classNames: (string | undefined | boolean)[]): string => classNames.filter(Boolean).join(' ');
