import { NextPage } from "next";
import { DonationCard } from "@components/DonationCard";
import { RecipientProfile } from "@components/RecipientProfile";
import { getTotalDonationsAmount } from "@donum/contracts/helpers";
import { reverseArray } from "@donum/shared/helpers";
import { useLiveDonationsHistory } from "@hooks/useLiveDonationsHistory";
import { Button } from "@components/Button";
import { EditIcon } from "@components/icons/EditIcon";
import Link from "next/link";
import { Loader } from "@components/Loader";
import { useSession } from "next-auth/react";
import { trpc } from "@lib/trpc";
import { routes } from "@lib/routes";

const DashboardPage: NextPage = () => {
  const { data: session } = useSession();
  // session, user and name can't be null here, because it's secured page and Layout will show warning
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const recipientAddress = session!.user!.name!;

  const {
    donations,
    isLoading: isDonationsLoading,
    isError: isDonationsError,
    error: donationsError,
  } = useLiveDonationsHistory(recipientAddress);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = trpc.profile.me.useQuery();

  if (isProfileLoading) return <Loader />;

  if (isDonationsError || isProfileError) {
    console.error(donationsError);
    console.error(profileError);
    return <div>Error!</div>;
  }

  if (!profile) return <div>You have no profile!</div>;

  return (
    <div className="flex w-full flex-col justify-between self-start lg:flex-row">
      <div className="flex flex-col items-center px-24">
        <RecipientProfile
          avatarPath={profile.avatarUrl}
          nickname={profile.nickname}
          address={recipientAddress}
          showAddress={!profile.nickname}
          shortAddress
        />
        <Link href={routes.editProfile(recipientAddress)}>
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
        {isDonationsLoading ? (
          <Loader />
        ) : (
          reverseArray(donations).map((donation, index) => (
            <DonationCard
              key={index}
              from={donation.from}
              timestamp={donation.timestamp}
              amount={donation.amount}
              message={donation.message}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
