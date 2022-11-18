import { NextPage } from "next";
import { DonationCard } from "@components/DonationCard";
import { RecipientProfile } from "@components/RecipientProfile";
import { getTotalDonationsAmount, reverseArray } from "@lib/helpers";
import { useLiveDonationsHistory } from "@hooks/useLiveDonationsHistory";
import { Button } from "@components/Button";
import { EditIcon } from "@components/icons/EditIcon";
import Link from "next/link";
import { Loader } from "@components/Loader";
import { useSession } from "next-auth/react";
import { trpc } from "@lib/trpc";

const DashboardPage: NextPage = () => {
  const editProfileButtonHandler = () => {
    console.log("edit profile button handler");
  };

  const { data: session } = useSession();
  // session, user and name can't be null here, because it's secured page and Layout will show warning
  const recipientAddress = session!.user!.name!;

  const { donations, isLoading, isError, error } =
    useLiveDonationsHistory(recipientAddress);

  const profile = trpc.profile.me.useQuery().data;

  if (isLoading) return <Loader />;

  if (!profile) return <div>You have no profile!</div>;

  if (isError) {
    console.error(error);
    return <div>Error!</div>;
  }

  return (
    <div className="flex flex-row flex-wrap justify-evenly">
      <div className="flex grow-0 flex-col items-center">
        <RecipientProfile
          avatarPath={profile.avatarUrl}
          nickname={profile.nickname || ""}
          address={recipientAddress}
          onEditClick={editProfileButtonHandler}
          shortAddress
        />
        <Link href={`/dashboard/edit/${recipientAddress}`} className="mt-3">
          <Button
            text="Edit profile"
            icon={<EditIcon size="small" />}
            size="small"
          />
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
