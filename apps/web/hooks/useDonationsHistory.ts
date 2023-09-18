import { useEffect, useState } from "react";
import { Address, useNetwork, usePublicClient } from "wagmi";
import { type NewDonationEvent } from "@donum/contracts/types/DonationsStore";
import { getContractAddressByChainId } from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";
import { type RemoveUndefined, isEthAddress } from "@donum/shared/helpers";

export const useDonationsHistory = (recipientAddress: string) => {
  const { chain } = useNetwork();
  const publicClient = usePublicClient();

  const [donations, setDonations] = useState<NewDonationEvent.OutputObject[]>(
    []
  );
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

    if (!recipientAddress) {
      setIsLoading(false);
      return;
    }

    if (!chain) {
      setIsLoading(false);
      return;
    }

    if (!isEthAddress(recipientAddress)) {
      onError(new Error("Invalid address"));
      return;
    }

    publicClient
      .createContractEventFilter({
        address: getContractAddressByChainId(chain.id)!,
        abi: DonationsStoreABI,
        eventName: "NewDonation",
        args: {
          to: recipientAddress as Address,
        },
        fromBlock: 0n,
        toBlock: "latest",
      })
      .then((filter) => publicClient.getFilterLogs({ filter }))
      .then((logs) => {
        const newDonations = logs.map((log) => {
          const { args } = log;
          return args as RemoveUndefined<typeof args>;
        });

        setDonations([...donations, ...newDonations]);
        setIsLoading(false);
      })
      .catch(onError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientAddress]);

  return { donations, isLoading, isError, error };
};
