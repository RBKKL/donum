import { NextPage } from "next";
import { useRouter } from "next/router";
import {BorderedImage, DonationCard} from "@components";
import { useGetAllDonations } from "@hooks/useGetAllDonations";
import {formatAddress, reverseArray} from "@lib/helpers";
import Image from "next/image";
import {BigNumber, ethers} from "ethers";
import {useContractEvent, useNetwork} from "wagmi";
import {CONTRACT_ABI, getContractAddressByChainId} from "@lib/smartContractsData";

const editProfileButtonHandler = () => {
  console.log("edit profile button handler");
};

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const recipientAddress = router.query.address as string;

  const { donations } = useGetAllDonations(recipientAddress);
  const { chain } = useNetwork();
  useContractEvent({
    addressOrName: getContractAddressByChainId(chain?.id),
    contractInterface: CONTRACT_ABI,
    eventName: "NewDonation",
    listener(from, amount, timestamp, message) {
      console.log("пипи кака");
  }});

  return (
    <div className="flex flex-row flex-wrap justify-evenly">
      <div className="flex flex-col items-center basis-80 grow-0">
        <BorderedImage src="/assets/images/default_avatar.gif" height={160} width={160} />
        <p className="text-2xl font-inter font-semibold py-2">Nix</p>
        <div className="flex flex-row flex-nowrap gap-x-2">
          <p className="text-sm text-ellipsis overflow-hidden align-center font-medium">
            {formatAddress(recipientAddress, 6, 5)}
          </p>
          <Image
            src="/assets/svg/edit_profile.svg"
            layout="fixed"
            width={16}
            height={16}
            onClick={editProfileButtonHandler}/>
        </div>
        <div className="flex flex-row flex-nowrap gap-x-4 mt-11">
          <p>Total donations amount: </p>
          {donations &&
            <p className="font-medium font-inter">
              {Number(ethers.utils.formatEther(
                donations!.reduce((a, b) => b.amount.add(a), BigNumber.from(0))
              ))} ETH
            </p>
          }
        </div>
      </div>
      <div className="flex flex-col flew-wrap justify-start gap-2.5 grow items-stretch max-w-5xl w-full">
        <p className="font-inter text-2xl self-center font-semibold text-white">Donation history</p>
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
