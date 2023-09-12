import { NewDonationEventObject } from "@donum/contracts/types/DonationsStore";
import { ChallengeObject } from "@donum/contracts/helpers";

export const toDonationObjectForWidget = (donation: NewDonationEventObject) => {
  return {
    from: donation.from,
    nickname: donation.nickname,
    amount: donation.amount.toString(),
    message: donation.message,
  };
};

export enum ChallengeStatus {
  PROPOSAL = "proposed",
  FAIL = "failed",
  COMPLETE = "completed",
}

export const toChallengeForWidget = (
  challenge: ChallengeObject,
  status: ChallengeStatus
) => {
  return {
    from: challenge.from,
    nickname: challenge.nickname,
    amount: challenge.proposalPrice.toString(),
    message: challenge.terms,
    award: challenge.award.toString(),
    status: status,
  };
};
