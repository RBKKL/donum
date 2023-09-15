import { NewDonationEvent } from "@donum/contracts/types/DonationsStore";
import { useContractEvent, useNetwork } from "wagmi";
import { getContractAddressByChainId } from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";
import { RemoveUndefined } from "@donum/shared/helpers";

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
