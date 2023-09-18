import {
  onMount,
  onCleanup,
  Switch,
  Match,
  createSignal,
  catchError,
} from "solid-js";
import { type Socket, io } from "socket.io-client";
import {
  DEFAULT_ALERT_DURATION,
  DEFAULT_DONATION_IMAGE_URL,
  DEFAULT_DONATION_SOUND_URL,
} from "@donum/shared/constants";
import { DonationAlert } from "@/components/donation-alert";
import { useDonationQueueMachine } from "@/hooks/useDonationQueueMachine";
import { DonationInfo } from "@/lib/types";
import { store, setStore } from "@/lib/store";
import { env } from "@/lib/env";

export const Widget = () => {
  const [error, setError] = createSignal<Error>();
  const { state, addToQueue } = useDonationQueueMachine();

  const onSocketConnect = (socket: Socket) => () => {
    console.log(`Connected to ${socket.id}!`);
  };

  const onNewDonation = (donation: DonationInfo) => {
    addToQueue({
      ...donation,
      duration: store.duration,
      soundSrc: store.soundSrc,
      imageSrc: store.imageSrc,
      imageType: store.imageType,
    });
  };

  const onSettingsChange = (
    notificationImageUrl: string,
    notificationSoundUrl: string,
    notificationDuration: number
  ) => {
    const imageSrc = notificationImageUrl || DEFAULT_DONATION_IMAGE_URL;
    const soundSrc = notificationSoundUrl || DEFAULT_DONATION_SOUND_URL;
    const duration = notificationDuration || DEFAULT_ALERT_DURATION;

    // determine type of notification image (TODO: maybe there is a better way to do so)
    fetch(imageSrc)
      .then((res) => {
        if (res.headers.get("content-type")?.includes("video")) {
          setStore("imageType", "video");
        }
      })
      .finally(() => {
        setStore({ imageSrc, soundSrc, duration });
      });
  };

  onMount(() => {
    catchError(() => {
      const params = new URLSearchParams(window.location.search);
      const address = params.get("address");
      if (!address) {
        throw new Error("No address was provided in search params");
      }

      const socket = io(env.EVENTS_SERVER_URL, {
        auth: {
          address,
        },
      });
      onCleanup(() => {
        socket.disconnect();
      });

      socket.on("connect", onSocketConnect(socket));
      socket.on("change-settings", onSettingsChange);
      socket.on("new-donation", onNewDonation);
    }, setError);
  });

  return (
    <Switch>
      <Match when={state.matches("showingDonation")}>
        <DonationAlert donation={state.context.queue[0]} />
      </Match>
      <Match when={!!error()}>Error: {error()?.message}</Match>
    </Switch>
  );
};
