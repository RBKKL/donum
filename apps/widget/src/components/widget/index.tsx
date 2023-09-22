import {
  onMount,
  onCleanup,
  Switch,
  Match,
  createSignal,
  catchError,
} from "solid-js";
import { type Socket, io } from "socket.io-client";
import { DonationAlert } from "~/components/donation-alert";
import { useDonationQueueMachine } from "~/hooks/useDonationQueueMachine";
import { metadataStore, setMetadataStore } from "~/lib/store";
import { env } from "~/lib/env";
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
    if (!metadataStore.isFilled) {
      setError(new Error("Metadata store was not filled"));
      return;
    }

    addToQueue({
      ...donation,
      duration: metadataStore.duration,
      soundSrc: metadataStore.soundSrc,
      imageSrc: metadataStore.imageSrc,
      imageType: metadataStore.imageType,
    });
  };

  const onSettingsChange: ServerToClientEvents["changeSettings"] = ({
    notificationDuration,
    notificationImageUrl,
    notificationSoundUrl,
  }) => {
    const imageSrc = notificationImageUrl;
    const soundSrc = notificationSoundUrl;
    const duration = notificationDuration;

    // determine type of notification image (TODO: maybe there is a better way to do so)
    fetch(imageSrc)
      .then((res) => {
        let imageType: "image" | "video" = "image";
        if (res.headers.get("content-type")?.includes("video")) {
          imageType = "video";
        }
        return imageType;
      })
      .then((imageType) => {
        setMetadataStore({
          isFilled: true,
          duration,
          imageSrc,
          imageType,
          soundSrc,
        });
      })
      .catch(setError);
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
