import { NextPage } from "next";
import { DonationAlert } from "@components/DonationAlert";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NewDonationEventObject } from "typechain-types/DonationsStore";
import { useNewDonationEvent } from "@hooks/useNewDonationEvent";
import { useQueue } from "react-use";
import { BigNumber } from "ethers";

const ALERT_DURATION = 5000;

const AlertPage: NextPage = () => {
  const router = useRouter();
  const recipientAddress = router.query.address as string;

  const TEST_DONATION = {
    from: recipientAddress,
    to: recipientAddress,
    amount: BigNumber.from("1000000000000000000"),
    timestamp: BigNumber.from(Date.now()),
    message: "test donation",
  };

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

  useEffect(() => {
    if (!router.query.test) {
      return;
    }

    pushQueue(TEST_DONATION);
  }, [router.query.test]);

  useNewDonationEvent((newDonation) => {
    if (newDonation.to === recipientAddress) {
      pushQueue(newDonation);
    }
  });

  return (
    <div className="h-full w-full  bg-green-screen">
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
