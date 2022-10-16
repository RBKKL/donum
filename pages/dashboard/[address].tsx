import { NextPage } from "next";
import { useRouter } from "next/router";
import { DonationCard, RecipientProfile } from "@components";
import { useGetAllDonations } from "@hooks/useGetAllDonations";
import { reverseArray } from "@lib/helpers";
import { BigNumber, ethers } from "ethers";
import { useContractEvent, useNetwork } from "wagmi";
import { CONTRACT_ABI, getContractAddressByChainId } from "@lib/smartContractsData";
import { DonationsStore } from "../../typechain-types";
import { useEffect, useState } from "react";
import { NewDonationEventObject } from "../../typechain-types/DonationsStore";

const editProfileButtonHandler = () => {
  console.log("edit profile button handler");
};

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const recipientAddress = router.query.address as string;

  const { donations: initialDonations, isLoading, isError, error } = useGetAllDonations(recipientAddress);
  const [donations, setDonations] = useState<NewDonationEventObject[]>([]);
  useEffect(() => {
    setDonations(initialDonations);
  }, [initialDonations])

  const { chain } = useNetwork();
  useContractEvent<DonationsStore>({
    addressOrName: getContractAddressByChainId(chain?.id),
    contractInterface: CONTRACT_ABI,
    eventName: "NewDonation",
    listener(donationEvent) {
      const donationInfo = {
        from: donationEvent[0],
        to: donationEvent[1],
        amount: donationEvent[2],
        timestamp: donationEvent[3],
        message: donationEvent[4]
      }
      if (donationInfo.to as string === recipientAddress) {
        setDonations([...donations, donationInfo])
      }
    }});

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    console.error(error);
    return <div>Error!</div>;
  }

  return (
    <div className="flex flex-row flex-wrap justify-evenly">
      <div className="flex flex-col items-center  grow-0">
        <RecipientProfile  avatarPath="/assets/images/default_avatar.gif"
                           nickname="Nix"
                           address={recipientAddress}
                           editable={true}
                           onEditClick={editProfileButtonHandler}
                           shortenedAddress={true}/>
        <div className="flex flex-row flex-nowrap mt-11">
          <p className="mr-4">Total donations amount: </p>
          {donations &&
            <p className="font-medium font-inter">
              {Number(ethers.utils.formatEther(
                donations!.reduce((a, b) => b.amount.add(a), BigNumber.from(0))
              )).toFixed(5)} ETH
            </p>
          }
        </div>
      </div>
      <div className="flex flex-col flew-wrap justify-start grow items-stretch max-w-5xl w-full">
        <p className="font-inter text-2xl self-center font-semibold text-white my-3">Donation history</p>
        {reverseArray(donations).map((donation, index) => (
          <DonationCard
            key={index}
            from={donation.from}
            timestamp={donation.timestamp}
            amount={donation.amount}
            message={donation.message}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
