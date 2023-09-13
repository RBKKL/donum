import { NewDonationEventObject } from "@donum/contracts/types/DonationsStore";
import { Address, useContractEvent, useNetwork } from "wagmi";
import { BigNumber } from "ethers";
import {
  castToDonationObject,
  getContractAddressByChainId,
} from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";

type NewDonationEventListener = (donation: NewDonationEventObject) => void;

export const useNewDonationEvent = (listener: NewDonationEventListener) => {
  const { chain } = useNetwork();
  useContractEvent({
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    eventName: "NewDonation",
    listener(
      ...newDonationArray: [
        Address,
        string,
        Address,
        BigNumber,
        BigNumber,
        string,
      ]
    ) {
      listener(castToDonationObject(newDonationArray));
    },
  });
};
