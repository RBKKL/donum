import { NewDonationEventObject } from "@donum/contracts/types/DonationsStore";

export const toDonationObjectForWidget = (donation: NewDonationEventObject) => {
  return {
    from: donation.nickname || donation.from,
    amount: donation.amount.toString(),
    message: donation.message,
  };
};
