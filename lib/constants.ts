export const INFURA_ID =
  process.env.NEXT_PUBLIC_INFURA_ID ?? "NO_INFURA_API_KEY";

export const APP_NAME = "Donum";
export const ALERT_PAGE_PATH = "/alert";
export const CONTRACT_NAME = "DonationsStore";

export const MESSAGE_MAX_LENGTH = 256;
export const NICKNAME_MAX_LENGTH = 64;
export const BIO_MAX_LENGTH = 65536;

export const CHAIN_IDS = {
  mainnet: 1,
  goerli: 5,
  hardhat: 1337,
};
