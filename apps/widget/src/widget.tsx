import { onMount, onError, onCleanup, Switch, Match } from "solid-js";
import { createStore } from "solid-js/store";
import { io, Socket } from "socket.io-client";
import { DonationAlert } from "./donation-alert";
import { DonationInfo, WidgetStore } from "./types";
import {
  DEFAULT_ALERT_DURATION,
  DEFAULT_DONATION_IMAGE_URL,
  DEFAULT_DONATION_SOUND_URL,
} from "@donum/shared/constants";

export const Widget = () => {
  const [store, setStore] = createStore<WidgetStore>({
    duration: DEFAULT_ALERT_DURATION,
    imageSrc: DEFAULT_DONATION_IMAGE_URL,
    soundSrc: DEFAULT_DONATION_SOUND_URL,
  });

  const setError = (error: Error) => {
    setStore("error", error);
  };

  const setSocket = (socket: Socket) => {
    setStore("socket", socket);
  };

  const showDonation = (donation: DonationInfo) => {
    console.log(`new donation: ${donation}`);
    setStore("donationInfo", donation);
    setTimeout(
      () => setStore("donationInfo", undefined),
      store.duration * 1000
    );
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

    socket.on(
      "change-settings",
      (notificationImageUrl, notificationSoundUrl, notificationDuration) => {
        setStore("imageSrc", notificationImageUrl);
        setStore("soundSrc", notificationSoundUrl);
        setStore("duration", notificationDuration);
      }
    );

    socket.on("new-donation", (donation) => {
      showDonation(donation);
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
      <Match when={!!store.donationInfo}>
        <DonationAlert
          // donationInfo won't be undefined here, because of the Match
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          donationInfo={store.donationInfo!}
          imageSrc={store.imageSrc}
          soundSrc={store.soundSrc}
        />
      </Match>
      <Match when={!!store.error}>Error: {store.error?.message}</Match>
    </Switch>
  );
};
