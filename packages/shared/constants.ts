export const APP_NAME = "Donum";
export const CONTRACT_NAME = "DonationsStore";
export const SIGN_IN_MESSAGE =
  "This will cost you nothing\nBelow is the technical information";
export const DEFAULT_DONATION_AMOUNT = "0.001";

export const MESSAGE_MAX_LENGTH = 256;
export const NICKNAME_MIN_LENGTH = 3;
export const NICKNAME_MAX_LENGTH = 64;
export const DESCRIPTION_MAX_LENGTH = 1024;
export const DEFAULT_ALERT_DURATION = 5000; // 5 seconds

export const AVATAR_MAX_SIZE = 1024 * 1024 * 10; // 10MB

export const AVATAR_ACCEPTABLE_FILE_TYPES = [
  "image/png",
  "image/gif",
  "image/jpeg",
];

export enum SessionStatus {
  UNAUTHENTICATED = "unauthenticated",
  AUTHENTICATED = "authenticated",
  LOADING = "loading",
}

export const DEFAULT_ADDRESS = "0xAC0772000aa52CbF8a8dB501cC8caC03cDF01bf6";

export const DEFAULT_TEST_DONATION = {
  from: "Test user",
  amount:
    "000000000000000000000000000000000000000000000000000000000001234567890000000000", // 1.23456789 ETH,
  message: "This is a test donation",
};
