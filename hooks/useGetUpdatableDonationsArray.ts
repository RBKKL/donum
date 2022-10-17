import { useGetAllDonations } from "@hooks/useGetAllDonations";
import { useEffect, useState } from "react";
import { DonationsStore, NewDonationEventObject } from "../typechain-types/DonationsStore";
import { useContractEvent, useNetwork } from "wagmi";
import { CONTRACT_ABI, getContractAddressByChainId } from "@lib/smartContractsData";
import { BigNumber } from "ethers";
import { newDonationArrayToObject } from "@lib/helpers";

export const useGetUpdatableDonationsArray = (recipientAddress: string) => {
  const {donations: initialDonations, isLoading, isError, error} = useGetAllDonations(recipientAddress);

  const [donations, setDonations] = useState<NewDonationEventObject[]>([]);
  useEffect(() => {
    setDonations(initialDonations);
  }, [initialDonations])

  const {chain} = useNetwork();
  useContractEvent<DonationsStore>({
    addressOrName: getContractAddressByChainId(chain?.id),
    contractInterface: CONTRACT_ABI,
    eventName: "NewDonation",
    listener(newDonationArray: [string, string, BigNumber, BigNumber, string]) {
      const donationInfo = newDonationArrayToObject(newDonationArray);
      if (donationInfo.to === recipientAddress) {
        setDonations([...donations, donationInfo])
      }
    }
  })

  return { donations, isLoading, isError, error };
}