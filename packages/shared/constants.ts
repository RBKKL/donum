import { NewDonationEventData } from "./events";

export const APP_NAME = "Donum";
export const CONTRACT_NAME = "DonationsStore";
export const SIGN_IN_MESSAGE =
  "This will cost you nothing\nBelow is the technical information";

export const MESSAGE_MAX_LENGTH = 256;
export const NICKNAME_MIN_LENGTH = 3;
export const NICKNAME_MAX_LENGTH = 64;
export const NICKNAME_CHECK_ALLOWANCE_DEBOUNCE = 500; // 0.5 seconds
export const DESCRIPTION_MAX_LENGTH = 1024;

export const DEFAULT_SHOW_AMOUNT = 1000000000000000n; // 0.001 ETH
export const MAX_DONATION_AMOUNT_LENGTH = 79; // 79 digits

export const AVATAR_MAX_SIZE = 1024 * 1024 * 10; // 10MB
export const NOTIFICATION_IMAGE_MAX_SIZE = 1024 * 1024 * 10; // 10MB
export const SOUND_MAX_SIZE = 1024 * 1024 * 20; // 20MB

const image_formats = ["image/png", "image/gif", "image/jpeg", "image/webp"];
const video_formats = ["video/mp4", "video/webm"];
const audio_formats = [
  "audio/mp4",
  "video/mp4",
  "audio/webm",
  "video/webm",
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
];

export const AVATAR_ACCEPTABLE_FILE_TYPES = [...image_formats];

export const NOTIFICATION_IMAGE_ACCEPTABLE_FILE_TYPES = [
  ...image_formats,
  ...video_formats,
];

export const SOUND_ACCEPTABLE_FILE_TYPES = [...audio_formats];

export enum SessionStatus {
  UNAUTHENTICATED = "unauthenticated",
  AUTHENTICATED = "authenticated",
  LOADING = "loading",
}

export const DEFAULT_ADDRESS = "0xAC0772000aa52CbF8a8dB501cC8caC03cDF01bf6";

export const DEFAULT_TEST_DONATION: NewDonationEventData = {
  from: "", // address
  nickname: "Test user",
  amount: "1234567890000000000", // 1.23456789 ETH,
  message: "This is a test donation",
};

export const DEFAULT_ALERT_DURATION = 5; // 5 seconds
export const DEFAULT_PAUSE_BETWEEN_ALERTS_DURATION = 1; // 1 second
export const DEFAULT_DONATION_IMAGE_URL = "/assets/default_image.gif";
export const DEFAULT_DONATION_SOUND_URL =
  "http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3";

export enum Periods {
  ALLTIME = "0",
  DAY = "86400000",
  WEEK = "604800000",
  MONTH = "2592000000",
  YEAR = "31449600000",
}

export const DONATION_CHARTS_PERIOD_OPTIONS = [
  { value: Periods.DAY, text: "24 hours" },
  { value: Periods.WEEK, text: "7 days" },
  { value: Periods.MONTH, text: "30 days" },
  { value: Periods.YEAR, text: "year" },
];

export const DONATION_STATS_PERIOD_OPTIONS = [
  { value: Periods.ALLTIME, text: "all time" },
  ...DONATION_CHARTS_PERIOD_OPTIONS,
];
