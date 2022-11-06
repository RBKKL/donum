import { BigNumber, ethers } from "ethers";
import { NewDonationEventObject } from "../typechain-types/DonationsStore";
import { format } from "date-fns";

export const isNumber = (value: string): boolean =>
  !!value.match(/^\d*\.?\d*$/);

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

export const castToDonationObject = (
  donationArray: [string, string, BigNumber, BigNumber, string]
): NewDonationEventObject => ({
  from: donationArray[0],
  to: donationArray[1],
  amount: donationArray[2],
  timestamp: donationArray[3],
  message: donationArray[4],
});

export const formatTimestamp = (timestamp: BigNumber): string => {
  return format(timestamp.mul(1000).toNumber(), "d MMMM yy  kk:mm");
};

export const getTotalDonationsAmount = (
  donations: NewDonationEventObject[]
): string => {
  const symbolsAfterComma = 5;
  return Number(
    ethers.utils.formatEther(
      donations.reduce((a, b) => b.amount.add(a), BigNumber.from(0))
    )
  ).toFixed(symbolsAfterComma);
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
