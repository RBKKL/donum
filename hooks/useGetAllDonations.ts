import { useContractRead, useNetwork } from "wagmi";
import {
  CONTRACT_ABI,
  getContractAddressByChainId,
} from "@lib/smartContractsData";
import { useEffect } from "react";
import { DonationsStore } from "typechain-types";

export const useGetAllDonations = (recipientAddress: string) => {
  const { chain } = useNetwork();

  const { data, isLoading, isError, error } = useContractRead({
    addressOrName: getContractAddressByChainId(chain?.id),
    contractInterface: CONTRACT_ABI,
    functionName: "getAllDonations",
    args: [recipientAddress],
  });
  const donations = data as DonationsStore.DonationStructOutput[] | undefined;

  useEffect(() => {
    console.log("isLoading:", isLoading);
    console.log("isError", isError);
    console.log("error:", error);
    console.log("data:", data);
    console.log("___________");
  }, [isLoading, isError, error, data]);

  return { donations, isError, isLoading, error };
};