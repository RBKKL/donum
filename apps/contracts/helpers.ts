import { BigNumber } from "ethers";
import { formatTokenAmount } from "@donum/shared/helpers";
import { CONTRACT_ADDRESSES } from "./constants";

interface NewDonationEventObject {
  from: string;
  nickname: string;
  to: string;
  amount: BigNumber;
  timestamp: BigNumber;
  message: string;
}

export interface ChallengeObject {
  from: string;
  nickname: string;
  to: string;
  proposalPrice: BigNumber;
  timestamp: BigNumber;
  terms: string;
  award: BigNumber;
  index: BigNumber;
}

export const castProposedChallengeObject = (
  challenge: [
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
): ChallengeObject => {
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

export const castDoneChallengeObject = (
  challenge: [
    string,
    string,
    BigNumber,
    BigNumber,
    {
      nickname: string;
      to: string;
      timestamp: BigNumber;
      terms: string;
      award: BigNumber;
      status: number;
    },
    ...unknown[]
  ]
): ChallengeObject => {
  return {
    from: challenge[0],
    nickname: challenge[0],
    to: challenge[1],
    proposalPrice: BigNumber.from(challenge[4].award),
    timestamp: BigNumber.from(challenge[2]),
    terms: challenge[4].terms,
    award: BigNumber.from(challenge[4].award),
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
