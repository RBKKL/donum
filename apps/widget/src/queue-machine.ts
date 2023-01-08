import { EventInfoWithMetadata } from "./types";
import { assign, createMachine } from "xstate";
import { DEFAULT_PAUSE_BETWEEN_ALERTS_DURATION } from "@donum/shared/constants";
import { waitSeconds } from "./utils";

export type QueueMachineEvent = {
  type: "ADD_TO_QUEUE";
  item: EventInfoWithMetadata;
};

export interface QueueMachineContext {
  queue: EventInfoWithMetadata[];
}

export const eventQueueMachine = createMachine<
  QueueMachineContext,
  QueueMachineEvent
>(
  {
    id: "eventsQueue",
    initial: "checkingIfThereAreMoreEvents",
    context: {
      queue: [],
    },
    states: {
      idle: {
        on: {
          ADD_TO_QUEUE: {
            actions: "addEventToQueue",
            target: "showingEvent",
          },
        },
      },
      showingEvent: {
        on: {
          ADD_TO_QUEUE: {
            actions: "addEventToQueue",
          },
        },
        invoke: {
          src: "showOldestEventInQueue",
          onDone: {
            target: "awaitingAfterShowingEvent",
            actions: ["removeOldestEventFromQueue"],
          },
        },
      },
      awaitingAfterShowingEvent: {
        on: {
          ADD_TO_QUEUE: {
            actions: "addEventToQueue",
          },
        },
        invoke: {
          src: "awaitAfterEventShow",
          onDone: {
            target: "checkingIfThereAreMoreEvents",
          },
        },
      },
      checkingIfThereAreMoreEvents: {
        on: {
          ADD_TO_QUEUE: {
            actions: "addEventToQueue",
          },
        },
        always: [
          {
            cond: "thereAreMoreEventsInTheQueue",
            target: "showingEvent",
          },
          {
            target: "idle",
          },
        ],
      },
    },
  },
  {
    guards: {
      thereAreMoreEventsInTheQueue: (context) => {
        return context.queue.length > 0;
      },
    },
    services: {
      showOldestEventInQueue: async (context) => {
        const oldestEvent = context.queue[0];
        if (!oldestEvent) {
          return;
        }
        await waitSeconds(oldestEvent.duration);
      },
      awaitAfterEventShow: async () => {
        await waitSeconds(DEFAULT_PAUSE_BETWEEN_ALERTS_DURATION);
      },
    },
    actions: {
      addEventToQueue: assign((context, event) => {
        if (event.type !== "ADD_TO_QUEUE") {
          return {};
        }
        return {
          queue: [...context.queue, event.item],
        };
      }),
      removeOldestEventFromQueue: assign((context) => {
        const [, ...newQueue] = context.queue;
        return {
          queue: newQueue,
        };
      }),
    },
  }
);
