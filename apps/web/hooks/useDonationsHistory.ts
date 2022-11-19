import { useEffect, useState } from "react";
import { useContract, useNetwork, useProvider } from "wagmi";
import type { NewDonationEventObject } from "@donum/contracts/types/DonationsStore";
import { ethers } from "ethers";
import { getContractAddressByChainId } from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";

export const useDonationsHistory = (recipientAddress: string) => {
  const { chain } = useNetwork();
  const provider = useProvider({ chainId: chain?.id });

  const donationsStore = useContract({
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    signerOrProvider: provider,
  });

  const [donations, setDonations] = useState<NewDonationEventObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>(undefined);

  const onError = (error: unknown) => {
    setIsLoading(false);
    setIsError(true);
    setError(error);
  };

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError(undefined);

    if (!donationsStore) {
      return;
    }

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
        recipientAddress,
        null,
        null,
        null
      );

      donationsStore
        .queryFilter(donationsFilter)
        .then((events) => {
          const donations = events.map(
            (event) => event.args as unknown as NewDonationEventObject
          );
          setDonations(donations);
          setIsLoading(false);
        })
        .catch(onError);
    } catch (error) {
      onError(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientAddress]);

  return { donations, isLoading, isError, error };
};
