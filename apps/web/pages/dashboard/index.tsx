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
import { getDonationsStatsByPeriod } from "@lib/statistics";
import { BigNumber } from "ethers";
import {
  DONATION_STATS_PERIOD_OPTIONS,
  Periods,
} from "@donum/shared/constants";
import { Select } from "@components/Select";
import { useState } from "react";

const DashboardPage: NextPage = () => {
  const { data: session } = useSession();
  // session, user and name can't be null here, because it's secured page and Layout will show warning
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const recipientAddress = session!.user!.name!;

  const [currentStatsPeriod, setCurrentStatsPeriod] = useState<string>(
    Periods.ALLTIME
  );

  const sendTestDonation = trpc.donation.sendTestDonation.useMutation();

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
    if (isDonationsLoading) return <Loader size={40} />;
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
    if (isDonationsLoading) return <Loader size={40} />;
    if (isDonationsError) return <div>Error!</div>;
    if (!donations) return <div>No donations yet!</div>;

    const [donationsAmount, donationsCount] = +currentStatsPeriod
      ? getDonationsStatsByPeriod(
          donations,
          BigNumber.from(Date.now() - +currentStatsPeriod),
          BigNumber.from(Date.now())
        )
      : [getTotalDonationsAmount(donations), donations.length];

    const data = [
      {
        title: "Total donations amount",
        value: `${donationsAmount} ETH`,
      },
      {
        title: "Total donations count",
        value: donationsCount,
      },
    ];

    return (
      <>
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
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
        <div className="flex flex-col items-center gap-2">
          <Button
            text="Send test donation alert"
            size="small"
            onClick={() => sendTestDonation.mutate()}
          />
          <Link href={routes.settings}>
            <Button
              text="Settings"
              icon={<EditIcon size="small" />}
              size="small"
            />
          </Link>
        </div>
        <div className="flex w-80 flex-col items-center pt-10">
          <div className="flex items-center self-start pl-12 pb-4">
            <h2 className="text-center text-2xl font-semibold text-white">
              Statistics
            </h2>
            <div className="ml-2">
              <Select
                options={DONATION_STATS_PERIOD_OPTIONS}
                selected={currentStatsPeriod}
                onSelect={setCurrentStatsPeriod}
              />
            </div>
          </div>
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
