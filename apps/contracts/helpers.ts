import { BigNumber, ethers } from "ethers";

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
  const symbolsAfterComma = 5;
  return Number(
    ethers.utils.formatEther(
      donations.reduce((a, b) => b.amount.add(a), BigNumber.from(0))
    )
  ).toFixed(symbolsAfterComma);
};
