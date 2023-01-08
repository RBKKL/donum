import { ChallengeFailedEventObject } from "@donum/contracts/types/DonationsStore";
import { Address, useContractEvent, useNetwork } from "wagmi";
import { BigNumber } from "ethers";
import {
  castToChallengeFailedEventObject,
  getContractAddressByChainId,
} from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";

type ChallengeFailedEventListener = (
  challenge: ChallengeFailedEventObject
) => void;

export const useChallengeFailedEvent = (
  listener: ChallengeFailedEventListener
) => {
  const { chain } = useNetwork();
  useContractEvent({
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    eventName: "ChallengeFailed",
    listener(
      ...challengeFailedArray: [Address, Address, BigNumber, BigNumber]
    ) {
      listener(castToChallengeFailedEventObject(challengeFailedArray));
    },
  });
};
