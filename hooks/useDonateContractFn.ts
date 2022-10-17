import { useEffect } from "react";
import { ethers } from "ethers";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
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

  const { config, error: prepareError } = usePrepareContractWrite({
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

  // TODO: should wait for transaction confirmation?
  // const {
  //   isSuccess: txSuccess,
  //   error: txError,
  //   data: txData,
  // } = useWaitForTransaction({
  //   confirmations: 1,
  //   hash: data?.hash,
  // });

  useEffect(() => {
    console.log("prepareError:", prepareError);
    console.log("isLoading:", isLoading);
    console.log("isError", isError);
    console.log("error:", error);
    console.log("data:", data);
    // console.log("txError", txError);
    // console.log("txSuccess", txSuccess);
    // console.log("txData:", txData);
    console.log("___________");
  }, [
    prepareError,
    isLoading,
    isError,
    error,
    data,
    // txError,
    // txSuccess,
    // txData,
  ]);

  return { donate, data, isAvailable, isLoading, isError };
};
