export const APP_NAME = "Donum";
export const ALERT_PAGE_PATH = "/alert";
export const DASHBOARD_PAGE_PATH = "/dashboard";
export const CONTRACT_NAME = "DonationsStore";
export const SIGN_IN_MESSAGE =
  "This will cost you nothing\nBelow is the technical information";

export const MESSAGE_MAX_LENGTH = 256;
export const NICKNAME_MIN_LENGTH = 3;
export const NICKNAME_MAX_LENGTH = 64;
export const DESCRIPTION_MAX_LENGTH = 1024;

export const avatarAcceptableFileExtensions =
  "image/png, image/gif, image/jpeg";

export const CHAIN_IDS = {
  mainnet: 1,
  goerli: 5,
  hardhat: 1337,
};

export enum SessionStatus {
  UNAUTHENTICATED = "unauthenticated",
  AUTHENTICATED = "authenticated",
  LOADING = "loading",
}
