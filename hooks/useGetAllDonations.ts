import { useNetwork } from "wagmi";
import { ethers } from "ethers";
import { INFURA_ID } from "@lib/constants";
import { CONTRACT_ABI, getContractAddressByChainId } from "@lib/smartContractsData";
import { useEffect, useState } from "react";
import { Donation } from "../types/Donation";

export const useGetAllDonations = (recipientAddress: string) => {
  const { chain } = useNetwork();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  let provider = new ethers.providers.InfuraProvider("goerli", INFURA_ID);
  let contractAddress = getContractAddressByChainId(chain?.id);
  let contract = new ethers.Contract(contractAddress, CONTRACT_ABI, provider);

  useEffect(() => {
    if (recipientAddress) {
      const filter = contract.filters.NewDonation(null, recipientAddress);
      contract.queryFilter(filter).then((events) => {
        const donations = events.map((event) => event.args) as unknown as Donation[];
        setDonations(donations);
        setIsLoading(false);
      });
    }
  }, [recipientAddress]);

  return { donations, isLoading };
};
