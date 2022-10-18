import { NextPage } from "next";
import { useRouter } from "next/router";
import { DonationCard, RecipientProfile } from "@components";
import { getTotalDonationsAmount, reverseArray } from "@lib/helpers";
import { useLiveDonationsHistory } from "@hooks/useLiveDonationsHistory";

const DashboardPage: NextPage = () => {
  const editProfileButtonHandler = () => {
    console.log("edit profile button handler");
  };

  const router = useRouter();
  const recipientAddress = router.query.address as string;
  const { donations, isLoading, isError, error } =
    useLiveDonationsHistory(recipientAddress);

  if (isLoading) return <div>Loading...</div>;

  if (isError) {
    console.error(error);
    return <div>Error!</div>;
  }

  return (
    <div className="flex flex-row flex-wrap justify-evenly">
      <div className="flex flex-col items-center grow-0">
        <RecipientProfile
          avatarPath="/assets/images/default_avatar.gif"
          nickname="Nix"
          address={recipientAddress}
          onEditClick={editProfileButtonHandler}
          shortAddress
        />
        <div className="flex flex-row flex-nowrap mt-11">
          <p className="mr-4">Total donations amount: </p>
          {donations && (
            <p className="font-medium">
              {getTotalDonationsAmount(donations)} ETH
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col flew-wrap justify-start grow items-stretch max-w-5xl w-full">
        <p className="text-2xl self-center font-semibold text-white my-3">
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
