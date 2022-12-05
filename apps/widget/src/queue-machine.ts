import { DonationInfo } from "./types";
import { assign, createMachine } from "xstate";
import { DEFAULT_PAUSE_BETWEEN_ALERTS_DURATION } from "@donum/shared/constants";
import { getDonationMetadataByType, wait } from "./utils";

export type QueueMachineEvent = {
  type: "ADD_TO_QUEUE";
  item: DonationInfo;
};

export interface QueueMachineContext {
  queue: DonationInfo[];
}

export const donationQueueMachine = createMachine<
  QueueMachineContext,
  QueueMachineEvent
>(
  {
    id: "donationQueue",
    initial: "checkingIfThereAreMoreDonations",
    context: {
      queue: [],
    },
    states: {
      idle: {
        on: {
          ADD_TO_QUEUE: {
            actions: "addDonationToQueue",
            target: "showingDonation",
          },
        },
      },
      showingDonation: {
        on: {
          ADD_TO_QUEUE: {
            actions: "addDonationToQueue",
          },
        },
        invoke: {
          src: "showOldestDonationInQueue",
          onDone: {
            target: "awaitingAfterShowingDonation",
            actions: ["removeOldestDonationFromQueue"],
          },
        },
      },
      awaitingAfterShowingDonation: {
        on: {
          ADD_TO_QUEUE: {
            actions: "addDonationToQueue",
          },
        },
        invoke: {
          src: "awaitAfterDonationShow",
          onDone: {
            target: "checkingIfThereAreMoreDonations",
          },
        },
      },
      checkingIfThereAreMoreDonations: {
        on: {
          ADD_TO_QUEUE: {
            actions: "addDonationToQueue",
          },
        },
        always: [
          {
            cond: "thereAreMoreDonationsInTheQueue",
            target: "showingDonation",
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
      thereAreMoreDonationsInTheQueue: (context) => {
        return context.queue.length > 0;
      },
    },
    services: {
      showOldestDonationInQueue: async (context) => {
        const oldestDonation = context.queue[0];
        if (!oldestDonation) {
          return;
        }
        await wait(getDonationMetadataByType(oldestDonation.type).duration);
      },
      awaitAfterDonationShow: async () => {
        await wait(DEFAULT_PAUSE_BETWEEN_ALERTS_DURATION);
      },
    },
    actions: {
      addDonationToQueue: assign((context, event) => {
        if (event.type !== "ADD_TO_QUEUE") {
          return {};
        }
        return {
          queue: [...context.queue, event.item],
        };
      }),
      removeOldestDonationFromQueue: assign((context) => {
        const [, ...newQueue] = context.queue;
        return {
          queue: newQueue,
        };
      }),
    },
  }
);
