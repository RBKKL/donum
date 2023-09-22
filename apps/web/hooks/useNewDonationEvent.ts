import { useContractEvent, useNetwork } from "wagmi";
import { DonationsStoreABI } from "@donum/contracts/abi";
import { getContractAddressByChainId } from "@donum/contracts/helpers";
import { NewDonationEvent } from "@donum/contracts/types/DonationsStore";
import type { RemoveUndefined } from "@donum/shared/type-utils";

type NewDonationEventListener = (
  donation: NewDonationEvent.OutputObject
) => void;

export const useNewDonationEvent = (listener: NewDonationEventListener) => {
  const { chain } = useNetwork();
  useContractEvent({
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    eventName: "NewDonation",
    listener(logs) {
      const { args } = logs[0];
      const newDonation = args as RemoveUndefined<typeof args>;
      listener(newDonation);
    },
  });
};
