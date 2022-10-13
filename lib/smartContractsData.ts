import { CHAIN_IDS } from "./constants";
import DonationsStoreContract from "../artifacts/contracts/DonationsStore.sol/DonationsStore.json";
import DonationsStoreContractGoerli from "../deployments/goerli/DonationsStore.json";

export const CONTRACT_ABI = DonationsStoreContract.abi;

export const CONTRACT_ADDRESSES = {
  [CHAIN_IDS.hardhat]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [CHAIN_IDS.goerli]: DonationsStoreContractGoerli.address,
};

export const getContractAddressByChainId = (
  chainId: number | undefined
): string => {
  if (chainId == undefined) {
    return "";
  }

  return CONTRACT_ADDRESSES[chainId];
};
