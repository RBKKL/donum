import {ADDRESS_LENGTH} from "@lib/constants";

export const isNumber = (value: string): boolean =>
  !!value.match(/^\d*\.?\d*$/);

export const reverseArray = <T>(arr: T[] | undefined): T[] => {
  if (!arr) {
    return [];
  }
  return [...arr].reverse();
};

export const formatAddress = (unformattedAddress: string, showStartSymbols: number, showEndSymbols: number): string => {
  if (unformattedAddress?.length != ADDRESS_LENGTH) {
    return "";
  }
  return unformattedAddress.slice(0, showStartSymbols) + "..." +
      unformattedAddress.slice(unformattedAddress.length - showEndSymbols, unformattedAddress.length)
};
