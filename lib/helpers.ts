import { CONTRACT_ADDRESSES } from "./constants";

export const getContractAddressByChainId = (
  chainId: number | undefined
): string => {
  if (chainId == undefined) {
    return "";
  }

  return CONTRACT_ADDRESSES[chainId];
};

export const isNumber = (value: string): boolean =>
  !!value.match(/^\d*\.?\d*$/);
