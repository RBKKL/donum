import { useDonationsHistory } from "@hooks/useDonationsHistory";
import { useEffect, useState } from "react";
import { NewDonationEventObject } from "../typechain-types/DonationsStore";
import { useNewDonationEvent } from "./useNewDonationEvent";

export const useLiveDonationsHistory = (recipientAddress: string) => {
  const [donations, setDonations] = useState<NewDonationEventObject[]>([]);

  const {
    donations: initialDonations,
    isLoading,
    isError,
    error,
  } = useDonationsHistory(recipientAddress);

  useEffect(() => {
    setDonations(initialDonations);
  }, [initialDonations]);

  useNewDonationEvent((donation) => {
    if (donation.to === recipientAddress) {
      setDonations([...donations, donation]);
    }
  });

  return { donations, isLoading, isError, error };
};
