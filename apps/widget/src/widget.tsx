import { onMount, onError, onCleanup, Switch, Match } from "solid-js";
import { createStore } from "solid-js/store";
import { io, Socket } from "socket.io-client";
import { DonationAlert } from "./donation-alert";
import { DonationInfo, WidgetStore } from "./types";
import { DEFAULT_ALERT_DURATION } from "@donum/shared/constants";

export const Widget = () => {
  const [store, setStore] = createStore<WidgetStore>({
    imageSrc: "/assets/default_image.gif",
    soundSrc:
      "http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
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
      DEFAULT_ALERT_DURATION
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

    socket.on("init-picture", (pictureUrl) => {
      setStore("imageSrc", pictureUrl);
    });

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
