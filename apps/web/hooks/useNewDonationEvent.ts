import {
  DonationsStore,
  NewDonationEventObject,
} from "contracts/types/DonationsStore";
import { useContractEvent, useNetwork } from "wagmi";
import {
  CONTRACT_ABI,
  getContractAddressByChainId,
} from "@lib/smartContractsData";
import { BigNumber } from "ethers";
import { castToDonationObject } from "@lib/helpers";

type NewDonationEventListener = (donation: NewDonationEventObject) => void;

export const useNewDonationEvent = (listener: NewDonationEventListener) => {
  const { chain } = useNetwork();
  useContractEvent<DonationsStore>({
    addressOrName: getContractAddressByChainId(chain?.id),
    contractInterface: CONTRACT_ABI,
    eventName: "NewDonation",
    listener(newDonationArray: [string, string, BigNumber, BigNumber, string]) {
      listener(castToDonationObject(newDonationArray));
    },
  });
};
