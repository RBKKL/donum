import {NextPage} from "next";
import {DonationAlert} from "@components/DonationAlert";
import {ethers} from "ethers";
import {useRouter} from "next/router";
import {useContractEvent, useNetwork} from "wagmi";
import {useEffect, useState} from "react";
import {CONTRACT_ABI, getContractAddressByChainId} from "@lib/smartContractsData";

type Donation = {
  from: string;
  amount: string;
  message: string;
};

const useAudio = () => {
  const [playing, setPlaying] = useState(false);

  const toggle = (isPlaying: boolean) => {
    setPlaying(isPlaying);
  }

  useEffect(() => {
    const audio = document.getElementById('a1') as HTMLVideoElement | null;
    if (audio) {
      playing ? audio.play() : audio.pause();
    }
  }, [playing]);

  return toggle;
};

const AlertPage: NextPage = () => {
  const [donationsQueue, setDonationsQueue] = useState<Donation[]>([]);
  const toggle = useAudio();

  useEffect(() => {
    if (donationsQueue.length === 0) {
      return;
    }
    toggle(true);

    setTimeout(() => {
      toggle(false);
      popDonation();
    }, 5000);
  }, [donationsQueue]);

  const pushDonation = (donation: Donation) => {
    setDonationsQueue((prev) => [...prev, donation]);
  }

  const popDonation = () => {
    const [, ...donations] = donationsQueue;
    setDonationsQueue(donations);
  }

  const {chain} = useNetwork();
  const router = useRouter();
  const recipientAddress = router.query.address as string;

  useContractEvent({
    addressOrName: getContractAddressByChainId(chain?.id),
    contractInterface: CONTRACT_ABI,
    eventName: 'NewDonation',
    listener(event) {
      if (recipientAddress == event[1]) {
        const donation: Donation = {
          from: event[0],
          amount: ethers.utils.formatEther(event[2]),
          message: event[4]
        }
        pushDonation(donation);
      }
    },
  });

  const donation = donationsQueue[0];

  if (donation)
    return (
        <DonationAlert
            src="/assets/images/default_avatar.gif"
            amount={donation?.amount}
            sender={donation?.from}
            message={donation?.message}/>
    ); else {
    return (<div className="w-full h-full bg-green-screen"/>);
  }
};

export default AlertPage;
