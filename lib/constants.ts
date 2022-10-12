import DonationsStoreContract from "../artifacts/contracts/DonationsStore.sol/DonationsStore.json";
import DonationsStoreContractGoerli from "../deployments/goerli/DonationsStore.json";

export const INFURA_ID =
  process.env.NEXT_PUBLIC_INFURA_ID ?? "NO_INFURA_API_KEY";

export const APP_NAME = "Donum";
export const CONTRACT_NAME = "DonationsStore";
export const CONTRACT_ABI = DonationsStoreContract.abi;

export const MESSAGE_MAX_LENGTH = 256;

export const CHAIN_IDS = {
  mainnet: 1,
  goerli: 5,
  hardhat: 1337,
};

export const CONTRACT_ADDRESSES = {
  [CHAIN_IDS.hardhat]: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  [CHAIN_IDS.goerli]: DonationsStoreContractGoerli.address,
};
