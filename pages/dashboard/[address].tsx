import { NextPage } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAccount } from "wagmi";
import { DonationCard } from "@components/DonationCard";
import { RecipientProfile } from "@components/RecipientProfile";
import { Button } from "@components/Button";
import { ConnectWalletWarning } from "@components/ConnectWalletWarning";
import { getTotalDonationsAmount, reverseArray } from "@lib/helpers";
import { useLiveDonationsHistory } from "@hooks/useLiveDonationsHistory";

const DashboardPage: NextPage = () => {
  const editProfileButtonHandler = () => {
    console.log("edit profile button handler");
  };
  const { isConnected } = useAccount();

  const router = useRouter();
  const recipientAddress = router.query.address as string;
  const { donations, isLoading, isError, error } =
    useLiveDonationsHistory(recipientAddress);

  //TODO: move to separate component on Next.js 13 migration
  if (!isConnected) {
    return <ConnectWalletWarning />;
  }

  if (isLoading) return <div>Loading...</div>;

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
        <Link href={`/profile/edit`}>
          <a className="mt-3">
            <Button text="Edit profile" />
          </a>
        </Link>
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
