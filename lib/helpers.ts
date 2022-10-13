export const isNumber = (value: string): boolean =>
  !!value.match(/^\d*\.?\d*$/);
