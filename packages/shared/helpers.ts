import { format } from "date-fns";
import { BigNumber } from "ethers";

// TODO: check for optimal
export const isNumber = (value: string): boolean =>
  !!value.match(/^\d+\.?\d*$/);

export const reverseArray = <T>(arr: T[] | undefined): T[] => {
  if (!arr) {
    return [];
  }
  return [...arr].reverse();
};

export const formatTimestamp = (timestamp: BigNumber): string => {
  return format(timestamp.mul(1000).toNumber(), "d MMMM yy  kk:mm");
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

export const formatBalance = (formattedBalance: string): string =>
  formattedBalance.substring(0, 7);
