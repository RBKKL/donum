import { BigNumber } from "ethers";
import { formatTokenAmount } from "../../packages/shared/helpers";
import { CONTRACT_ADDRESSES } from "./constants";

interface NewDonationEventObject {
  from: string;
  to: string;
  amount: BigNumber;
  timestamp: BigNumber;
  message: string;
}

export const castToDonationObject = (
  donationArray: [string, string, BigNumber, BigNumber, string, ...unknown[]]
): NewDonationEventObject => ({
  from: donationArray[0],
  to: donationArray[1],
  amount: donationArray[2],
  timestamp: donationArray[3],
  message: donationArray[4],
});

export const getTotalDonationsAmount = (
  donations: NewDonationEventObject[]
): string => {
  return formatTokenAmount(
    donations.reduce((a, b) => b.amount.add(a), BigNumber.from(0))
  );
};

export const getContractAddressByChainId = (
  chainId: number | undefined
): string | undefined => {
  if (!chainId) return undefined;
  return CONTRACT_ADDRESSES[chainId];
};
