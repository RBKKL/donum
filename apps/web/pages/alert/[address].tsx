import { NextPage } from "next";
import { DonationAlert } from "@components/DonationAlert";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { NewDonationEventObject } from "contracts/types/DonationsStore";
import { useNewDonationEvent } from "@hooks/useNewDonationEvent";
import { useQueue } from "react-use";
import { trpc } from "@lib/trpc";
import { ethers } from "ethers";

const ALERT_DURATION = 5000;

const AlertPage: NextPage = () => {
  const router = useRouter();
  const recipientAddress = router.query.address as string;
  const profile = trpc.profile.byAddress.useQuery({
    address: recipientAddress,
  });

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

  useNewDonationEvent(async (newDonation) => {
    const minShowAmount = await profile?.data?.minShowAmount;
    if (
      newDonation.to === recipientAddress &&
      newDonation.amount.gte(ethers.BigNumber.from(minShowAmount))
    ) {
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
