import {
  onMount,
  onCleanup,
  Switch,
  Match,
  createSignal,
  catchError,
} from "solid-js";
import { type Socket, io } from "socket.io-client";
import { DonationAlert } from "@/components/donation-alert";
import { useDonationQueueMachine } from "@/hooks/useDonationQueueMachine";
import { store, setStore } from "@/lib/store";
import { env } from "@/lib/env";
import {
  ClientToServerEvents,
  NewDonationEventData,
  ServerToClientEvents,
} from "@donum/shared/events";

export const Widget = () => {
  const [error, setError] = createSignal<Error>();
  const { state, addToQueue } = useDonationQueueMachine();

  const onSocketConnect = (socket: Socket) => () => {
    console.log(`Connected to ${socket.id}!`);
  };

  const onNewDonation: ServerToClientEvents["newDonation"] = (
    donation: NewDonationEventData
  ) => {
    addToQueue({
      ...donation,
      duration: store.duration,
      soundSrc: store.soundSrc,
      imageSrc: store.imageSrc,
      imageType: store.imageType,
    });
  };

  const onSettingsChange: ServerToClientEvents["changeSettings"] = ({
    notificationDuration,
    notificationImageUrl,
    notificationSoundUrl,
  }) => {
    const imageSrc = notificationImageUrl || store.imageSrc;
    const soundSrc = notificationSoundUrl || store.soundSrc;
    const duration = notificationDuration ?? store.duration;

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

      const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
        env.EVENTS_SERVER_URL,
        {
          auth: {
            address,
          },
        }
      );
      onCleanup(() => {
        socket.disconnect();
      });

      socket.on("connect", onSocketConnect(socket));
      socket.on("changeSettings", onSettingsChange);
      socket.on("newDonation", onNewDonation);
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
