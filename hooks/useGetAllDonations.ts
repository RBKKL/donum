import { useEffect, useState } from "react";
import { useContract, useNetwork, useProvider } from "wagmi";
import {
  CONTRACT_ABI,
  getContractAddressByChainId,
} from "@lib/smartContractsData";
import type {
  DonationsStore,
  NewDonationEventObject,
} from "../typechain-types/DonationsStore";
import { ethers } from "ethers";

export const useGetAllDonations = (recipientAddress: string) => {
  const { chain } = useNetwork();
  const provider = useProvider({ chainId: chain?.id });
  const donationsStore = useContract<DonationsStore>({
    addressOrName: getContractAddressByChainId(chain?.id),
    contractInterface: CONTRACT_ABI,
    signerOrProvider: provider,
  });

  const [donations, setDonations] = useState<NewDonationEventObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(undefined);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    if (!recipientAddress) {
      setIsLoading(false);
      return;
    }

    try {
      if (!ethers.utils.isAddress(recipientAddress)) {
        throw new Error("Invalid address");
      }

      const donationsFilter = donationsStore.filters.NewDonation(
        null,
        recipientAddress
      );

      donationsStore
        .queryFilter(donationsFilter)
        .then((events) => {
          const donations = events.map((event) => event.args);
          setDonations(donations);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setIsError(true);
          setError(error);
        });
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
      setError(error);
    }
  }, [recipientAddress]);

  return { donations, isLoading, isError, error };
};
