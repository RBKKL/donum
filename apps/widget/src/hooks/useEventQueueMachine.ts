import { useMachine } from "./useMachine";
import { eventQueueMachine } from "../queue-machine";
import { EventInfoWithMetadata } from "../types";

export const useEventQueueMachine = () => {
  const { state, send } = useMachine(eventQueueMachine);

  const addToQueue = (event: EventInfoWithMetadata) => {
    send("ADD_TO_QUEUE", { item: event });
  };

  return { state, addToQueue };
};
