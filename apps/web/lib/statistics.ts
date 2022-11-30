import { NewDonationEventObject } from "@donum/contracts/types/DonationsStore";
import { formatTokenAmount } from "@donum/shared/helpers";
import { BigNumber } from "ethers";

export const getDonationsStatsByPeriod = (
  donations: NewDonationEventObject[],
  periodStart: BigNumber,
  periodEnd: BigNumber
): [string, number] => {
  const donationsByPeriod = donations.filter(
    (donation) =>
      donation.timestamp >= periodStart && donation.timestamp <= periodEnd
  );

  return [
    formatTokenAmount(
      donationsByPeriod.reduce((a, b) => b.amount.add(a), BigNumber.from(0))
    ),
    donationsByPeriod.length,
  ];
};
