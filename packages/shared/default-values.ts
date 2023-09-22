import type { NewDonationEventData } from "./events";

// TODO: use env var
const baseStaticUrl = "http://localhost:54321/storage/v1/object/public/static";

// default profile values
export const DEFAULT_AVATAR_URL = `${baseStaticUrl}/default_avatar.gif`;
export const DEFAULT_MIN_SHOW_AMOUNT = 1000000000000000n; // 0.001 ETH in wei

// default notification settings
export const DEFAULT_ALERT_DURATION = 5; // in seconds
export const DEFAULT_PAUSE_BETWEEN_ALERTS_DURATION = 1; // in seconds
export const DEFAULT_NOTIFICATION_IMAGE_URL = `${baseStaticUrl}/default_notification_image.gif`;
export const DEFAULT_NOTIFICATION_SOUND_URL = `${baseStaticUrl}/default_notification_sound.mp3`;

export const DEFAULT_TEST_DONATION: NewDonationEventData = {
  from: "0x000000000000000000000000000000000000DaDa", // dummy address
  nickname: "Test user",
  amount: "1234567890000000000", // 1.23456789 ETH,
  message: "This is a test donation",
};
