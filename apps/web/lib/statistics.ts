import { NewDonationEvent } from "@donum/contracts/types/DonationsStore";
import { formatTokenAmount } from "@donum/shared/helpers";

export const getDonationsStatsByPeriod = (
  donations: NewDonationEvent.OutputObject[],
  periodStart: bigint,
  periodEnd: bigint
): [string, number] => {
  const donationsByPeriod = donations.filter((donation) => {
    const timestamp = donation.timestamp * 1000n; // convert to ms
    return timestamp >= periodStart && timestamp <= periodEnd;
  });

  return [
    formatTokenAmount(donationsByPeriod.reduce((acc, d) => acc + d.amount, 0n)),
    donationsByPeriod.length,
  ];
};
