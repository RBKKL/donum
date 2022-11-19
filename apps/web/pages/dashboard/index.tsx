import { NextPage } from "next";
import { DonationCard } from "@components/DonationCard";
import { RecipientProfile } from "@components/RecipientProfile";
import { getTotalDonationsAmount } from "contracts/helpers";
import { reverseArray } from "shared/helpers";
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

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = trpc.profile.me.useQuery();

  if (isLoading || isProfileLoading) return <Loader />;

  if (isError || isProfileError) {
    console.error(error);
    console.error(profileError);
    return <div>Error!</div>;
  }

  if (!profile) return <div>You have no profile!</div>;

  return (
    <div className="flex w-full flex-col lg:flex-row justify-between self-start">
      <div className="flex flex-col items-center px-24">
        <RecipientProfile
          avatarPath={profile.avatarUrl}
          nickname={profile.nickname || ""}
        />
        <Link href={`/dashboard/edit/${recipientAddress}`}>
          <Button
            text="Edit profile"
            icon={<EditIcon size="small" />}
            size="small"
          />
        </Link>
        <div className="pt-10">
          <h2 className="text-center text-2xl text-white">Statistics</h2>
          <p className="whitespace-nowrap pt-4 text-zinc-50">
            Total donations amount:
            {donations && (
              <span className="pl-8 text-lg font-medium">
                {getTotalDonationsAmount(donations)} ETH
              </span>
            )}
          </p>
        </div>
      </div>
      <div className="flex grow flex-col items-center pt-10 lg:pt-0">
        <p className="my-3 text-2xl font-semibold text-white">
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
