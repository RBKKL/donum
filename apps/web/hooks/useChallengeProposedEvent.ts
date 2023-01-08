import { ChallengeProposedEventObject } from "@donum/contracts/types/DonationsStore";
import { Address, useContractEvent, useNetwork } from "wagmi";
import { BigNumber } from "ethers";
import {
  castToChallengeProposedEventObject,
  getContractAddressByChainId,
} from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";

type ChallengeProposedEventListener = (
  challenge: ChallengeProposedEventObject
) => void;

export const useChallengeProposedEvent = (
  listener: ChallengeProposedEventListener
) => {
  const { chain } = useNetwork();
  useContractEvent({
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    eventName: "ChallengeProposed",
    listener(
      ...challengeProposedArray: [
        Address,
        string,
        Address,
        BigNumber,
        BigNumber,
        string,
        BigNumber,
        BigNumber
      ]
    ) {
      listener(castToChallengeProposedEventObject(challengeProposedArray));
    },
  });
};
