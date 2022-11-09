import { NextPage } from "next";
import { DonationAlert } from "@components/DonationAlert";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NewDonationEventObject } from "contracts/types/DonationsStore";
import { useNewDonationEvent } from "@hooks/useNewDonationEvent";
import { useQueue } from "react-use";

const ALERT_DURATION = 5000;

const AlertPage: NextPage = () => {
  const router = useRouter();
  const recipientAddress = router.query.address as string;

  const {
    add: pushQueue,
    remove: popQueue,
    first: currentDonation,
  } = useQueue<NewDonationEventObject>();

  useEffect(() => {
    if (!currentDonation) {
      return;
    }

    setTimeout(() => {
      popQueue();
    }, ALERT_DURATION);
  }, [currentDonation, popQueue]);

  useNewDonationEvent((newDonation) => {
    if (newDonation.to === recipientAddress) {
      pushQueue(newDonation);
    }
  });

  return (
    <div className="bg-green-screen h-full  w-full">
      {currentDonation && (
        <DonationAlert
          src="/assets/images/default_avatar.gif"
          amount={currentDonation.amount}
          sender={currentDonation.from}
          message={currentDonation.message}
        />
      )}
    </div>
  );
};

export default AlertPage;
