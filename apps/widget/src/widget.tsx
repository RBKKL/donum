import { onMount, onError, onCleanup, Switch, Match } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { io, Socket } from "socket.io-client";
import { DonationAlert } from "./donation-alert";
import { DonationInfo, DonationMetadata, WidgetStore } from "./types";
import {
  DEFAULT_ALERT_DURATION,
  DEFAULT_ALERT_IMAGE,
  DEFAULT_ALERT_SOUND,
  DEFAULT_PAUSE_BETWEEN_ALERTS_DURATION,
} from "@donum/shared/constants";

/* eslint-disable @typescript-eslint/no-unused-vars */
const getDonationMetadataByType = (donationType: string): DonationMetadata => {
  // TODO: return metadata depending on donation type
  return {
    soundSrc: DEFAULT_ALERT_SOUND,
    imageSrc: DEFAULT_ALERT_IMAGE,
    duration: DEFAULT_ALERT_DURATION,
  };
};

export const Widget = () => {
  const [store, setStore] = createStore<WidgetStore>({
    donations: [],
    isShowingDonation: false,
    isBetweenDonations: false,
  });

  const setError = (error: Error) => {
    setStore("error", error);
  };

  const setSocket = (socket: Socket) => {
    setStore("socket", socket);
  };

  const showDonations = () => {
    if (
      store.isShowingDonation ||
      store.isBetweenDonations ||
      store.donations.length < 1
    ) {
      return;
    }

    setStore("isShowingDonation", true);
    const notificationDuration = getDonationMetadataByType(
      store.donations[0].type
    ).duration;

    setTimeout(() => {
      setStore("isShowingDonation", false);
      setStore("isBetweenDonations", true);
      setStore(
        "donations",
        produce((donations) => {
          donations.shift();
        })
      );
    }, notificationDuration);
    setTimeout(() => {
      setStore("isBetweenDonations", false);
      if (store.donations.length > 0) {
        showDonations();
      }
    }, notificationDuration + DEFAULT_PAUSE_BETWEEN_ALERTS_DURATION);
  };

  const addDonation = (donation: DonationInfo) => {
    console.log(`new donation: ${donation}`);

    // TODO: set donation.type depending on donation.amount or something else
    donation.type = "default";

    setStore(
      "donations",
      produce((donations) => {
        donations.push(donation);
      })
    );
    showDonations();
  };

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const address = params.get("address");
    if (!address) {
      throw new Error("No address was provided in search params");
    }

    const socket = io("http://localhost:8000", {
      auth: {
        address,
      },
    });
    setSocket(socket);

    socket.on("connect", () => {
      console.log(`Connected to server with id: ${socket.id}`);
    });

    socket.on("new-donation", (donation) => {
      addDonation(donation);
    });
  });

  onError((error) => {
    setError(error);
  });

  onCleanup(() => {
    store.socket?.disconnect();
  });

  return (
    <Switch>
      <Match when={store.isShowingDonation}>
        <DonationAlert
          // need cast for disable warning, actually store.donations.peek() is never undefined here
          donationInfo={store.donations[0]}
          imageSrc={getDonationMetadataByType(store.donations[0].type).imageSrc}
          soundSrc={getDonationMetadataByType(store.donations[0].type).soundSrc}
        />
      </Match>
      <Match when={!!store.error}>Error: {store.error?.message}</Match>
    </Switch>
  );
};
