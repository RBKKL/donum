import { useContractEvent, useNetwork } from "wagmi";
import {
  castDoneChallengeObject,
  ChallengeObject,
  getContractAddressByChainId,
} from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";

type ChallengeFailedEventListener = (challenge: ChallengeObject) => void;

export const useChallengeFailedEvent = (
  listener: ChallengeFailedEventListener
) => {
  const { chain } = useNetwork();
  useContractEvent({
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    eventName: "ChallengeFailed",
    listener(...challengeFailedArray) {
      listener(castDoneChallengeObject(challengeFailedArray));
    },
  });
};
