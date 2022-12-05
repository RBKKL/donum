import { NewDonationEventObject } from "@donum/contracts/types/DonationsStore";

export const toDonationObjectForWidget = (donation: NewDonationEventObject) => {
  return {
    from: donation.from,
    nickname: donation.nickname,
    amount: donation.amount.toString(),
    message: donation.message,
  };
};
