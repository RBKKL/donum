import { ChallengeFailedEventObject } from "@donum/contracts/types/DonationsStore";
import { useContractEvent, useNetwork } from "wagmi";
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
    listener(...challengeFailedArray) {
      listener(castToChallengeFailedEventObject(challengeFailedArray));
    },
  });
};
