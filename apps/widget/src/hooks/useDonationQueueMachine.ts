import { useMachine } from "./useMachine";
import { donationQueueMachine } from "../queue-machine";
import { DonationInfo } from "../types";

export const useDonationQueueMachine = () => {
  const { state, send } = useMachine(donationQueueMachine);

  const addToQueue = (donation: DonationInfo) => {
    send("ADD_TO_QUEUE", { item: donation });
  };

  return { state, addToQueue };
};
