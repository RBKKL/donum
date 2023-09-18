import { useMachine } from "@xstate/solid";
import { NewDonationWithMetadata } from "@donum/shared/events";
import { donationQueueMachine } from "@/lib/queue-machine";

export const useDonationQueueMachine = () => {
  const [state, send] = useMachine(donationQueueMachine);

  const addToQueue = (donation: NewDonationWithMetadata) => {
    send({ type: "ADD_TO_QUEUE", item: donation });
  };

  return { state, addToQueue };
};
