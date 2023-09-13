import { useMachine } from "@xstate/solid";
import { donationQueueMachine } from "../queue-machine";
import { DonationInfoWithMetadata } from "../types";

export const useDonationQueueMachine = () => {
  const [state, send] = useMachine(donationQueueMachine);

  const addToQueue = (donation: DonationInfoWithMetadata) => {
    send({ type: "ADD_TO_QUEUE", item: donation });
  };

  return { state, addToQueue };
};
