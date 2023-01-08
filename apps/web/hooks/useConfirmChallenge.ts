import { useEffect } from "react";
import { BigNumber } from "ethers";
import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { getContractAddressByChainId } from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";

export const useConfirmChallenge = (index: BigNumber) => {
  const { chain } = useNetwork();

  const { config, error: prepareError } = usePrepareContractWrite({
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    functionName: "completeChallenge",
    args: [index],
  });

  const { write, data, isLoading, isError, error } = useContractWrite(config);
  const confirmChallenge = () => {
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

  return { confirmChallenge, data, isLoading, isError, error };
};
