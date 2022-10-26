import { NextPage } from "next";
import { useRouter } from "next/router";
import { DonationCard } from "@components/DonationCard";
import { RecipientProfile } from "@components/RecipientProfile";
import { getTotalDonationsAmount, reverseArray } from "@lib/helpers";
import { useLiveDonationsHistory } from "@hooks/useLiveDonationsHistory";
import { useAccount } from "wagmi";
import { Connect } from "@components/Connect";

const DashboardPage: NextPage = () => {
  const editProfileButtonHandler = () => {
    console.log("edit profile button handler");
  };
  const { isConnected } = useAccount();

  const router = useRouter();
  const recipientAddress = router.query.address as string;
  const { donations, isLoading, isError, error } =
    useLiveDonationsHistory(recipientAddress);

  if (isLoading) return <div>Loading...</div>;

  if (!isConnected) {
    return <Connect/>
  }

  if (isError) {
    console.error(error);
    return <div>Error!</div>;
  }

  return (
    <div className="flex flex-row flex-wrap justify-evenly">
      <div className="flex grow-0 flex-col items-center">
        <RecipientProfile
          avatarPath="/assets/images/default_avatar.gif"
          nickname="Nix"
          address={recipientAddress}
          onEditClick={editProfileButtonHandler}
          shortAddress
        />
        <div className="mt-11 flex flex-row flex-nowrap">
          <p className="mr-4">Total donations amount: </p>
          {donations && (
            <p className="font-medium">
              {getTotalDonationsAmount(donations)} ETH
            </p>
          )}
        </div>
      </div>
      <div className="flew-wrap flex w-full max-w-5xl grow flex-col items-stretch justify-start">
        <p className="my-3 self-center text-2xl font-semibold text-white">
          Donations history
        </p>
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
