import { createStore } from "solid-js/store";
import { DonationMetadata } from "@donum/shared/events";
import type { Merge } from "@donum/shared/type-utils";

type MetadataStore =
  | { isFilled: false }
  | Merge<{ isFilled: true }, DonationMetadata>;

export const [metadataStore, setMetadataStore] = createStore<MetadataStore>({
  isFilled: false,
});
