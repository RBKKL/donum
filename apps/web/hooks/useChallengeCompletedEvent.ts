import { useContractEvent, useNetwork } from "wagmi";
import {
  castDoneChallengeObject,
  ChallengeObject,
  getContractAddressByChainId,
} from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";

type ChallengeCompletedEventListener = (challenge: ChallengeObject) => void;

export const useChallengeCompletedEvent = (
  listener: ChallengeCompletedEventListener
) => {
  const { chain } = useNetwork();
  useContractEvent({
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    eventName: "ChallengeCompleted",
    listener(...challengeCompletedArray) {
      listener(castDoneChallengeObject(challengeCompletedArray));
    },
  });
};
