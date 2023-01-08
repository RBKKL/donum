import { ChallengeCompletedEventObject } from "@donum/contracts/types/DonationsStore";
import { Address, useContractEvent, useNetwork } from "wagmi";
import { BigNumber } from "ethers";
import {castToChallengeCompletedEventObject, getContractAddressByChainId} from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";

type ChallengeCompletedEventListener = (
  challenge: ChallengeCompletedEventObject
) => void;

export const useChallengeCompletedEvent = (
  listener: ChallengeCompletedEventListener
) => {
  const { chain } = useNetwork();
  useContractEvent({
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    eventName: "ChallengeCompleted",
    listener(
      ...challengeCompletedArray: [Address, Address, BigNumber, BigNumber]
    ) {
      listener(castToChallengeCompletedEventObject(challengeCompletedArray));
    },
  });
};
