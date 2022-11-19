import { onMount, onError, onCleanup, Switch, Match } from "solid-js";
import { createStore } from "solid-js/store";
import { io, Socket } from "socket.io-client";
import { Donation } from "./donation";
import { DonationType, Store } from "./types";

export const Widget = () => {
  const [store, setStore] = createStore<Store>({});

  const setError = (error: Error) => {
    setStore("error", error);
  };

  const setSocket = (socket: Socket) => {
    setStore("socket", socket);
  };

  const showDonation = (donation: DonationType) => {
    console.log(`new donation: ${donation}`);
    setStore("donation", donation);
    setTimeout(() => setStore("donation", undefined), 5000);
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
      <Match when={!!store.donation}>
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <Donation donation={store.donation!} />
      </Match>
      <Match when={!!store.error}>Error: {store.error?.message}</Match>
    </Switch>
  );
};
