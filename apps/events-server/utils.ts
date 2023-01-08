import {
  ChallengeProposedEventObject,
  NewDonationEventObject,
} from "@donum/contracts/types/DonationsStore";

export const toDonationObjectForWidget = (donation: NewDonationEventObject) => {
  return {
    from: donation.from,
    nickname: donation.nickname,
    amount: donation.amount.toString(),
    message: donation.message,
  };
};

enum ChallengeStatus {
  PROPOSAL = "proposal",
  FAIL = "fail",
  COMPLETE = "complete",
}

export const toProposalChallengeForWidget = (
  challenge: ChallengeProposedEventObject
) => {
  return {
    from: challenge.from,
    nickname: challenge.nickname,
    amount: challenge.proposalPrice.toString(),
    message: challenge.terms,
    award: challenge.award.toString(),
    status: ChallengeStatus.PROPOSAL,
  };
};
