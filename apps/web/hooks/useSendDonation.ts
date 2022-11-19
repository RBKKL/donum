import { useEffect } from "react";
import { ethers } from "ethers";
import {
  Address,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { getContractAddressByChainId } from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";

export const useSendDonation = (
  recipientAddress: Address,
  donationAmount: string,
  message: string
) => {
  const { chain } = useNetwork();

  const isValidAmount = !!donationAmount;

  const { config, error: prepareError } = usePrepareContractWrite({
    enabled: isValidAmount,
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    functionName: "donate",
    args: [recipientAddress, message],
    overrides: {
      value: ethers.utils.parseEther(donationAmount || "0"),
    },
  });

  const { write, data, isLoading, isError, error } = useContractWrite(config);
  const isAvailable = !!write && Number(donationAmount) !== 0;
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
