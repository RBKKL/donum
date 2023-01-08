import { BigNumber } from "ethers";
import { formatTokenAmount } from "@donum/shared/helpers";
import { CONTRACT_ADDRESSES } from "./constants";
import {
  ChallengeFailedEvent,
  ChallengeFailedEventObject,
  ChallengeProposedEvent,
  ChallengeProposedEventObject,
} from "./types/DonationsStore";

interface NewDonationEventObject {
  from: string;
  nickname: string;
  to: string;
  amount: BigNumber;
  timestamp: BigNumber;
  message: string;
}

export const castToProposedChallengeObject = (
  challenge: [
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    string,
    BigNumber,
    BigNumber,
    ChallengeProposedEvent
  ]
): ChallengeProposedEventObject => {
  return {
    from: challenge[0],
    nickname: challenge[1],
    to: challenge[2],
    proposalPrice: BigNumber.from(challenge[3]),
    timestamp: BigNumber.from(challenge[4]),
    terms: challenge[5],
    award: BigNumber.from(challenge[6]),
    index: BigNumber.from(challenge[7]),
  };
};

export const castToFailedChallengeObject = (
  challenge: [string, string, BigNumber, BigNumber, ChallengeFailedEvent]
): ChallengeFailedEventObject => {
  return {
    from: challenge[0],
    to: challenge[1],
    timestamp: BigNumber.from(challenge[2]),
    index: BigNumber.from(challenge[3]),
  };
};

export const castToDonationObject = (
  donationArray: [
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    string,
    ...unknown[]
  ]
): NewDonationEventObject => ({
  from: donationArray[0],
  nickname: donationArray[1],
  to: donationArray[2],
  amount: donationArray[3],
  timestamp: donationArray[4],
  message: donationArray[5],
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
