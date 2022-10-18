import { useEffect } from "react";
import { ethers } from "ethers";
import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import {
  CONTRACT_ABI,
  getContractAddressByChainId,
} from "@lib/smartContractsData";

export const useDonateContractFn = (
  recipientAddress: string,
  donationAmount: string,
  message: string
) => {
  const { chain } = useNetwork();

  const isValidAmount = !!donationAmount;

  const { config, error: prepareError } = usePrepareContractWrite({
    enabled: isValidAmount,
    addressOrName: getContractAddressByChainId(chain?.id),
    contractInterface: CONTRACT_ABI,
    functionName: "donate",
    args: [recipientAddress, message],
    overrides: {
      value: ethers.utils.parseEther(donationAmount || "0"),
    },
  });

  const { write, data, isLoading, isError, error } = useContractWrite(config);
  const isAvailable = !!write;
  const donate = () => {
    write?.();
  };

  useEffect(() => {
    console.log("prepareError:", prepareError);
    console.log("isLoading:", isLoading);
    console.log("isError", isError);
    console.log("error:", error);
    console.log("data:", data);
    console.log("___________");
  }, [prepareError, isLoading, isError, error, data]);

  return { donate, data, isAvailable, isLoading, isError };
};
