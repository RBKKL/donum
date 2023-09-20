import type { NewDonationEventData } from "./events";

export const DEFAULT_SHOW_AMOUNT = 1000000000000000n; // 0.001 ETH

export const DEFAULT_TEST_DONATION: NewDonationEventData = {
  from: "0x000000000000000000000000000000000000DaDa", // dummy address
  nickname: "Test user",
  amount: "1234567890000000000", // 1.23456789 ETH,
  message: "This is a test donation",
};

export const DEFAULT_ALERT_DURATION = 5; // 5 seconds
export const DEFAULT_PAUSE_BETWEEN_ALERTS_DURATION = 1; // 1 second
export const DEFAULT_DONATION_IMAGE_URL = "/assets/default_image.gif"; // relative to widget origin (e.g. https://widget.donum.me)
export const DEFAULT_DONATION_SOUND_URL =
  "http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3";
