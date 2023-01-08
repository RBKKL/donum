import { BigNumber } from "ethers";
import { formatTokenAmount } from "../../packages/shared/helpers";
import { CONTRACT_ADDRESSES } from "./constants";
import {
  ChallengeCompletedEventObject,
  ChallengeFailedEventObject,
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

export const castToChallengeProposedEventObject = (
  challengeProposedArray: [
    string,
    string,
    string,
    BigNumber,
    BigNumber,
    string,
    BigNumber,
    BigNumber,
    ...unknown[]
  ]
): ChallengeProposedEventObject => ({
  from: challengeProposedArray[0],
  nickname: challengeProposedArray[1],
  to: challengeProposedArray[2],
  proposalPrice: challengeProposedArray[3],
  timestamp: challengeProposedArray[4],
  terms: challengeProposedArray[5],
  award: challengeProposedArray[6],
  index: challengeProposedArray[7],
});

export const castToChallengeCompletedEventObject = (
  challengeCompletedArray: [string, string, BigNumber, BigNumber, ...unknown[]]
): ChallengeCompletedEventObject => ({
  from: challengeCompletedArray[0],
  to: challengeCompletedArray[1],
  timestamp: challengeCompletedArray[2],
  index: challengeCompletedArray[3],
});

export const castToChallengeFailedEventObject = (
  challengeFailedArray: [string, string, BigNumber, BigNumber, ...unknown[]]
): ChallengeFailedEventObject => ({
  from: challengeFailedArray[0],
  to: challengeFailedArray[1],
  timestamp: challengeFailedArray[2],
  index: challengeFailedArray[3],
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
