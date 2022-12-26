import { onMount, onError, onCleanup, Switch, Match } from "solid-js";
import { createStore } from "solid-js/store";
import { io, Socket } from "socket.io-client";
import { DonationAlert } from "./donation-alert";
import { DonationInfo, WidgetStore } from "./types";
import { useDonationQueueMachine } from "./hooks/useDonationQueueMachine";
import {
  DEFAULT_ALERT_DURATION,
  DEFAULT_DONATION_IMAGE_URL,
  DEFAULT_DONATION_SOUND_URL,
} from "@donum/shared/constants";
import { clientEnv } from "./client-env";

export const Widget = () => {
  const { state, addToQueue } = useDonationQueueMachine();
  const [store, setStore] = createStore<WidgetStore>({
    duration: DEFAULT_ALERT_DURATION,
    imageSrc: DEFAULT_DONATION_IMAGE_URL,
    imageType: "image",
    soundSrc: DEFAULT_DONATION_SOUND_URL,
  });

  const setError = (error: Error) => {
    setStore("error", error);
  };

  const setSocket = (socket: Socket) => {
    setStore("socket", socket);
  };

  const addDonation = (donation: DonationInfo) => {
    console.log("new donation:");
    console.log(donation);

    addToQueue({
      ...donation,
      duration: store.duration,
      soundSrc: store.soundSrc,
      imageSrc: store.imageSrc,
      imageType: store.imageType,
    });
  };

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const address = params.get("address");
    if (!address) {
      throw new Error("No address was provided in search params");
    }

    const socket = io(clientEnv.EVENTS_SERVER_URL, {
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
        const imageSrc = notificationImageUrl || DEFAULT_DONATION_IMAGE_URL;
        const soundSrc = notificationSoundUrl || DEFAULT_DONATION_SOUND_URL;

        // determine type of notification image (TODO: maybe there is a better way to do so)
        fetch(imageSrc).then((res) => {
          if (res.headers.get("content-type")?.includes("video")) {
            setStore("imageType", "video");
          }
        });
        setStore("imageSrc", imageSrc);
        setStore("soundSrc", soundSrc);
        setStore("duration", notificationDuration);
      }
    );

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
      <Match when={state.matches("showingDonation")}>
        <DonationAlert
          // need cast for disable warning, actually store.donations.peek() is never undefined here
          donation={state.context.queue[0]}
        />
      </Match>
      <Match when={!!store.error}>Error: {store.error?.message}</Match>
    </Switch>
  );
};
