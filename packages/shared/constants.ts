export const APP_NAME = "Donum";
export const CONTRACT_NAME = "DonationsStore";

export const MESSAGE_MAX_LENGTH = 256;
export const NICKNAME_MIN_LENGTH = 3;
export const NICKNAME_MAX_LENGTH = 64;
export const NICKNAME_CHECK_ALLOWANCE_DEBOUNCE = 500; // 0.5 seconds
export const DESCRIPTION_MAX_LENGTH = 1024;
export const MAX_DONATION_AMOUNT_LENGTH = 79; // 77 digits + "." + "-"

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

export enum StatFramePeriod {
  // NAME = "milliseconds"
  ALLTIME = "0",
  DAY = "86400000",
  WEEK = "604800000",
  MONTH = "2592000000",
  YEAR = "31449600000",
}
