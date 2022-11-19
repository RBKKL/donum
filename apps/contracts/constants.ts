import DonationsStoreContractGoerli from "./deployments/goerli/DonationsStore.json";
export { DonationsStoreABI } from "./artifacts/contracts/DonationsStore.sol/DonationsStoreABI";

export const CHAIN_IDS = {
  mainnet: 1,
  goerli: 5,
  hardhat: 1337,
};

export const CONTRACT_ADDRESSES = {
  [CHAIN_IDS.goerli]: DonationsStoreContractGoerli.address,
};
