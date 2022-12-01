/* eslint-disable @typescript-eslint/no-unused-vars */
import {DonationMetadata} from "./types";
import {DEFAULT_ALERT_DURATION, DEFAULT_ALERT_IMAGE, DEFAULT_ALERT_SOUND} from "@donum/shared/constants";

export const getDonationMetadataByType = (donationType: string): DonationMetadata => {
  // TODO: return metadata depending on donation type
  return {
    soundSrc: DEFAULT_ALERT_SOUND,
    imageSrc: DEFAULT_ALERT_IMAGE,
    duration: DEFAULT_ALERT_DURATION,
  };
};

export const wait = (interval: number) =>
  new Promise((resolve) => setTimeout(resolve, interval));