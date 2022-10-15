import {ADDRESS_LENGTH, ADDRESS_START_SYMBOLS_SHOW_AMOUNT, ADDRESS_END_SYMBOLS_SHOW_AMOUNT} from "@lib/constants";

export const isNumber = (value: string): boolean =>
  !!value.match(/^\d*\.?\d*$/);

export const reverseArray = <T>(arr: T[] | undefined): T[] => {
  if (!arr) {
    return [];
  }
  return [...arr].reverse();
};

export const formatAddress = (unformattedAddress: string): string => {
  if (unformattedAddress.length != ADDRESS_LENGTH) {
    return "";
  }
  return unformattedAddress.slice(0, ADDRESS_START_SYMBOLS_SHOW_AMOUNT) + "..." +
      unformattedAddress.slice(unformattedAddress.length - ADDRESS_END_SYMBOLS_SHOW_AMOUNT, unformattedAddress.length)
};
