import { createStore } from "solid-js/store";
import { DonationMetadata } from "@donum/shared/events";
import {
  DEFAULT_ALERT_DURATION,
  DEFAULT_DONATION_IMAGE_URL,
  DEFAULT_DONATION_SOUND_URL,
} from "@donum/shared/default-values";

interface WidgetStore extends DonationMetadata {}

export const [store, setStore] = createStore<WidgetStore>({
  duration: DEFAULT_ALERT_DURATION,
  imageSrc: DEFAULT_DONATION_IMAGE_URL,
  imageType: "image",
  soundSrc: DEFAULT_DONATION_SOUND_URL,
});
