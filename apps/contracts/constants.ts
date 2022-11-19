import DonationsStoreContractGoerli from "./deployments/goerli/DonationsStore.json";

export const CHAIN_IDS = {
  mainnet: 1,
  goerli: 5,
  hardhat: 1337,
};

export const CONTRACT_ADDRESSES = {
  [CHAIN_IDS.goerli]: DonationsStoreContractGoerli.address,
};
