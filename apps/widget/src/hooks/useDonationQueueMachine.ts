import { useMachine } from "@xstate/solid";
import { donationQueueMachine } from "@/lib/queue-machine";
import { DonationInfoWithMetadata } from "@/lib/types";

export const useDonationQueueMachine = () => {
  const [state, send] = useMachine(donationQueueMachine);

  const addToQueue = (donation: DonationInfoWithMetadata) => {
    send({ type: "ADD_TO_QUEUE", item: donation });
  };

  return { state, addToQueue };
};
