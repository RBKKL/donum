export const isNumber = (value: string): boolean =>
  !!value.match(/^\d*\.?\d*$/);

export const reverseArray = <T>(arr: T[] | undefined): T[] => {
  if (!arr) {
    return [];
  }
  return [...arr].reverse();
};
