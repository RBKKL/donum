import { useEffect, useState } from "react";
import { NewDonationEvent } from "@donum/contracts/types/DonationsStore";
import { useDonationsHistory } from "@hooks/useDonationsHistory";
import { useNewDonationEvent } from "./useNewDonationEvent";

export const useLiveDonationsHistory = (recipientAddress: string) => {
  const [donations, setDonations] = useState<NewDonationEvent.OutputObject[]>(
    []
  );

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
