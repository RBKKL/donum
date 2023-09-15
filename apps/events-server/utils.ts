import { NewDonationEvent } from "@donum/contracts/types/DonationsStore";

export const toDonationObjectForWidget = (
  donation: NewDonationEvent.OutputObject
) => {
  return {
    from: donation.from,
    nickname: donation.nickname,
    amount: donation.amount.toString(),
    message: donation.message,
  };
};
