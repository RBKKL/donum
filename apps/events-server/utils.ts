import { NewDonationEventObject } from "contracts/types/DonationsStore";

export const toDonationObjectForWidget = (donation: NewDonationEventObject) => {
  return {
    from: donation.from,
    amount: donation.amount.toString(),
    message: donation.message,
  };
};
