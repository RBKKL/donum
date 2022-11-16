import { BigNumber } from "ethers";
import { format } from "date-fns";
import { FetchBalanceResult } from "@wagmi/core";
export {
  castToDonationObject,
  getTotalDonationsAmount,
} from "contracts/helpers";

// TODO: check for optimal
export const isNumber = (value: string): boolean =>
  !!value.match(/^\d+\.?\d*$/);

export const reverseArray = <T>(arr: T[] | undefined): T[] => {
  if (!arr) {
    return [];
  }
  return [...arr].reverse();
};

export const formatAddress = (address?: string): string => {
  if (!address) {
    return "";
  }

  const leadingChars = 4;
  const trailingChars = 4;

  return address.length < leadingChars + trailingChars
    ? address
    : `${address.substring(0, leadingChars)}\u2026${address.substring(
        address.length - trailingChars
      )}`;
};

export const formatTimestamp = (timestamp: BigNumber): string => {
  return format(timestamp.mul(1000).toNumber(), "d MMMM yy  kk:mm");
};

export const fileToBase64 = (file: File): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result?.toString());
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const base64ToBlob = async (base64string: string) => {
  const base64Response = await fetch(base64string);
  return await base64Response.blob();
};

export const formatBalance = (balanceData: FetchBalanceResult): string =>
  balanceData.formatted.substring(0, 7);
