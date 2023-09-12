import { Address, useContractRead, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { getContractAddressByChainId } from "@donum/contracts/helpers";
import { DonationsStoreABI } from "@donum/contracts/abi";

export const useSentChallengesHistory = (senderAddress: string) => {
  const { chain } = useNetwork();

  const { data, isLoading, isError, error } = useContractRead({
    enabled: ethers.utils.isAddress(senderAddress),
    address: getContractAddressByChainId(chain?.id),
    abi: DonationsStoreABI,
    functionName: "getProposedChallenges",
    args: [senderAddress as Address],
  });

  return { data, isLoading, isError, error };
};
