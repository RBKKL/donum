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

export const formatAddress = (address: string): string => {
  const leadingChars = 4;
  const trailingChars = 4;

  return address.length < leadingChars + trailingChars
    ? address
    : `${address.substring(0, leadingChars)}\u2026${address.substring(
      address.length - trailingChars
    )}`;
};

export const newDonationArrayToObject =
  (newDonationArray: [string, string, BigNumber, BigNumber, string]): NewDonationEventObject => ({
  from: newDonationArray[0],
  to: newDonationArray[1],
  amount: newDonationArray[2],
  timestamp: newDonationArray[3],
  message: newDonationArray[4]
})

export const formatTimestamp = (timestamp: BigNumber): string => {
  return format(timestamp.mul(1000).toNumber(), "d MMMM yy  kk:mm")
}

export const getTotalDonationsAmount = (donations: NewDonationEventObject[]): string => {
  const symbolsAfterComma = 5;
  return Number(ethers.utils
    .formatEther(donations.reduce((a, b) => b.amount.add(a), BigNumber.from(0))))
    .toFixed(symbolsAfterComma);
}
