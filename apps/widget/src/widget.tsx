import { onMount, onError, onCleanup, Switch, Match } from "solid-js";
import {createStore, unwrap} from "solid-js/store";
import { io, Socket } from "socket.io-client";
import { DonationAlert } from "./donation-alert";
import { DonationInfo, WidgetStore } from "./types";
import {getDonationMetadataByType} from "./utils";
import {donationQueueMachine} from "./queue-machine";
import {useMachine} from "./useMachine";

export const Widget = () => {
  const [store, setStore] = createStore<WidgetStore>({});
  const [state, send] = useMachine(donationQueueMachine);

  const setError = (error: Error) => {
    setStore("error", error);
  };

  const setSocket = (socket: Socket) => {
    setStore("socket", socket);
  };

  const addDonation = (donation: DonationInfo) => {
    console.log("new donation:");
    console.log(donation);

    // TODO: set donation.type depending on donation.amount or something else
    donation.type = "default";

    send("ADD_TO_QUEUE", donation);
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
      <Match when={state.matches("showingDonation")}>
        <DonationAlert
          // need cast for disable warning, actually store.donations.peek() is never undefined here
          donationInfo={state.context.queue[0]}
          imageSrc={getDonationMetadataByType(state.context.queue[0].type).imageSrc}
          soundSrc={getDonationMetadataByType(state.context.queue[0].type).soundSrc}
        />
      </Match>
      <Match when={!!store.error}>Error: {store.error?.message}</Match>
    </Switch>
  );
};
