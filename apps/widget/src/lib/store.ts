import { createStore } from "solid-js/store";
import { DonationMetadata } from "./types";
import {
  DEFAULT_ALERT_DURATION,
  DEFAULT_DONATION_IMAGE_URL,
  DEFAULT_DONATION_SOUND_URL,
} from "@donum/shared/constants";

interface WidgetStore extends DonationMetadata {}

export const [store, setStore] = createStore<WidgetStore>({
  duration: DEFAULT_ALERT_DURATION,
  imageSrc: DEFAULT_DONATION_IMAGE_URL,
  imageType: "image",
  soundSrc: DEFAULT_DONATION_SOUND_URL,
});
