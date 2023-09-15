import { formatTokenAmount } from "../../packages/shared/helpers";
import { CONTRACT_ADDRESSES } from "./constants";
import { NewDonationEvent } from "./types/DonationsStore";

export const castToDonationObject = (
  donationArray: [...NewDonationEvent.OutputTuple, ...unknown[]]
): NewDonationEvent.OutputObject => ({
  from: donationArray[0],
  nickname: donationArray[1],
  to: donationArray[2],
  amount: donationArray[3],
  timestamp: donationArray[4],
  message: donationArray[5],
});

export const getTotalDonationsAmount = (
  donations: NewDonationEvent.OutputObject[]
): string => {
  return formatTokenAmount(donations.reduce((acc, d) => acc + d.amount, 0n));
};

export const getContractAddressByChainId = (
  chainId: number | undefined // FIXME: remove undefined
): `0x${string}` | undefined => {
  if (!chainId) return undefined;
  return CONTRACT_ADDRESSES[chainId] as `0x${string}`;
};
