import { useEffect } from "react";
import { BigNumber } from "ethers";
import { useContractWrite, useNetwork, usePrepareContractWrite } from "wagmi";
import { getContractAddressByChainId } from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";

export const useRejectChallenge = (index: BigNumber) => {
  const { chain } = useNetwork();

  const { config, error: prepareError } = usePrepareContractWrite({
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    functionName: "failChallenge",
    args: [index],
  });

  const { write, data, isLoading, isError, error } = useContractWrite(config);
  const rejectChallenge = () => {
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

  return { rejectChallenge, data, isLoading, isError, error };
};
