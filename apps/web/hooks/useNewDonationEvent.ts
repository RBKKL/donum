import { NewDonationEventObject } from "contracts/types/DonationsStore";
import { Address, useContractEvent, useNetwork } from "wagmi";
import {
  DonationsStoreABI,
  getContractAddressByChainId,
} from "@lib/smartContractsData";
import { BigNumber } from "ethers";
import { castToDonationObject } from "contracts/helpers";

type NewDonationEventListener = (donation: NewDonationEventObject) => void;

export const useNewDonationEvent = (listener: NewDonationEventListener) => {
  const { chain } = useNetwork();
  useContractEvent({
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    eventName: "NewDonation",
    listener(
      ...newDonationArray: [Address, Address, BigNumber, BigNumber, string]
    ) {
      listener(castToDonationObject(newDonationArray));
    },
  });
};
