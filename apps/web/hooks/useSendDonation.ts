import { useEffect } from "react";
import {
  Address,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { getContractAddressByChainId } from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";

export const useSendDonation = (
  senderNickname: string,
  recipientAddress: Address,
  amount: bigint,
  message: string
) => {
  const { chain } = useNetwork();

  const isValidAmount = !!amount;

  const { config, error: prepareError } = usePrepareContractWrite({
    enabled: isValidAmount,
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    functionName: "donate",
    args: [senderNickname, recipientAddress, message],
    value: amount,
  });

  const { write, data, isLoading, isError, error } = useContractWrite(config);
  const isAvailable = !!write && amount !== 0n;
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
