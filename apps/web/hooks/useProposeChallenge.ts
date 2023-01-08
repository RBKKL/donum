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

export const useProposeChallenge = (
  senderNickname: string,
  recipientAddress: Address,
  proposalPrice: string,
  terms: string,
  awardAmountString: string
) => {
  const { chain } = useNetwork();

  const isValidAmount = !!awardAmountString;

  const awardAmount = ethers.utils.parseEther(awardAmountString || "0");

  const awardWithProposalPrice = ethers.utils
    .parseEther(proposalPrice)
    .add(awardAmount);

  const { config, error: prepareError } = usePrepareContractWrite({
    enabled: isValidAmount,
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    functionName: "proposeChallenge",
    args: [senderNickname, recipientAddress, terms, awardAmount],
    overrides: {
      value: awardWithProposalPrice,
    },
  });

  const { write, data, isLoading, isError, error } = useContractWrite(config);
  const isAvailable = !!write && awardAmount.gt(0);
  const proposeChallenge = () => {
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

  return { proposeChallenge, data, isAvailable, isLoading, isError };
};
