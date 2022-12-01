import {DonationInfo} from "./types";
import {assign, createMachine} from "xstate";

export type QueueMachineEvent =
  | {
  type: 'ADD_TO_QUEUE';
  items: DonationInfo[];
}

export interface QueueMachineContext {
  queue: DonationInfo[];
}

export const donationQueueMachine = createMachine<QueueMachineContext, QueueMachineEvent>({
    id: 'donationQueue',
    initial: 'checkingIfThereAreMoreItems',
    context: {
      queue: [],
    },
    states: {
      idle: {
        on: {
          ADD_TO_QUEUE: {
            actions: 'addItemToQueue',
            target: 'executingItem',
          },
        },
      },
      executingItem: {
        on: {
          ADD_TO_QUEUE: {
            actions: 'addItemToQueue',
          },
        },
        invoke: {
          src: 'executeOldestItemInQueue',
          onDone: {
            target: 'awaitingAfterExecution',
            actions: ['removeOldestItemFromQueue'],
          },
        },
      },
      awaitingAfterExecution: {
        on: {
          ADD_TO_QUEUE: {
            actions: 'addItemToQueue',
          },
        },
        invoke: {
          src: 'awaitAfterExec',
          onDone: {
            target: 'checkingIfThereAreMoreItems',
          },
        },
      },
      checkingIfThereAreMoreItems: {
        on: {
          ADD_TO_QUEUE: {
            actions: 'addItemToQueue',
          },
        },
        always: [
          {
            cond: 'thereAreMoreItemsInTheQueue',
            target: 'executingItem',
          },
          {
            target: 'idle',
          },
        ],
      },
    },
  },
  {
    guards: {
      thereAreMoreItemsInTheQueue: (context) => {
        return context.queue.length > 0;
      },
    },
    services: {
      executeOldestItemInQueue: async (context) => {
        const oldestItem = context.queue[0];
        if (!oldestItem) return;
        await wait(2000);
      },
      awaitAfterExec: async (context) => {
        await wait(1000);
      },
    },
    actions: {
      addItemToQueue: assign((context, event) => {
        if (event.type !== 'ADD_TO_QUEUE') {
          return {};
        }
        return {
          queue: [
            ...context.queue,
            ...(event.items?.map((item) => ({
              ...item,
              timeAdded: new Date().toISOString(),
            })) || []),
          ],
        };
      }),
      removeOldestItemFromQueue: assign((context) => {
        const [, ...newQueue] = context.queue;
        return {
          queue: newQueue,
        };
      }),
    },
  },);