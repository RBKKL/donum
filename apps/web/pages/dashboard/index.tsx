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

  const renderDonationsHistory = () => {
    if (isDonationsLoading) return <Loader />;
    if (isDonationsError) return <div>Error!</div>;
    if (!donations) return <div>No donations yet!</div>;

    return reverseArray(donations).map((donation, index) => (
      <DonationCard
        key={index}
        from={donation.from}
        timestamp={donation.timestamp}
        amount={donation.amount}
        message={donation.message}
      />
    ));
  };

  const renderDonationsStats = () => {
    if (isDonationsLoading) return <Loader />;
    if (isDonationsError) return <div>Error!</div>;
    if (!donations) return <div>No donations yet!</div>;

    const totalDonationsAmount = getTotalDonationsAmount(donations);
    const totalDonationsCount = donations.length;

    const data = [
      {
        title: "Total donations amount",
        value: `${totalDonationsAmount} ETH`,
      },
      {
        title: "Total donations count",
        value: totalDonationsCount,
      },
    ];

    return (
      <>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center pt-4">
            <div className="text-xl font-bold">{item.value}</div>
            <div className="text-sm text-gray-400">{item.title}</div>
          </div>
        ))}
      </>
    );
  };

  return (
    <div className="flex w-full flex-col justify-between self-start lg:flex-row">
      <div className="flex min-w-[30%] flex-col items-center">
        <RecipientProfile
          avatarUrl={profile.avatarUrl}
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
          <h2 className="text-center text-2xl font-semibold text-white">
            Statistics
          </h2>
          {renderDonationsStats()}
        </div>
      </div>
      <div className="flex grow flex-col items-center pt-10 lg:pt-0">
        <p className="mb-3 text-2xl font-semibold text-white">
          Donations history
        </p>
        {renderDonationsHistory()}
      </div>
    </div>
  );
};

export default DashboardPage;
