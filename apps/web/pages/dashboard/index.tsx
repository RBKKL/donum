import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getTotalDonationsAmount } from "@donum/contracts/helpers";
import { StatFramePeriod } from "@donum/shared/constants";
import { formatNickname, reverseArray } from "@donum/shared/helpers";
import { Button } from "~/components/Button";
import { Chart } from "~/components/Chart";
import { DonationCard } from "~/components/DonationCard";
import { EditIcon } from "~/components/icons/EditIcon";
import { Loader } from "~/components/Loader";
import { RecipientProfile } from "~/components/RecipientProfile";
import { Select } from "~/components/Select";
import { useLiveDonationsHistory } from "~/hooks/useLiveDonationsHistory";
import { routes } from "~/lib/routes";
import { getDonationsStatsByPeriod } from "~/lib/statistics";
import { trpc } from "~/lib/trpc";
import type { ExtendedNextPage } from "~/pages/_app";

const DONATION_CHARTS_PERIOD_OPTIONS = [
  { value: StatFramePeriod.DAY, text: "24 hours" },
  { value: StatFramePeriod.WEEK, text: "7 days" },
  { value: StatFramePeriod.MONTH, text: "30 days" },
  { value: StatFramePeriod.YEAR, text: "year" },
];

const DONATION_STATS_PERIOD_OPTIONS = [
  ...DONATION_CHARTS_PERIOD_OPTIONS,
  { value: StatFramePeriod.ALLTIME, text: "all time" },
];

const DashboardPage: ExtendedNextPage = () => {
  const { data: session } = useSession();
  // session can't be null here, because it's secured page and Layout will show warning
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const recipientAddress = session!.user.address;

  const [currentStatsPeriod, setCurrentStatsPeriod] = useState<string>(
    StatFramePeriod.ALLTIME
  );
  const [currentChartsPeriod, setCurrentChartsPeriod] = useState<string>(
    StatFramePeriod.DAY
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
        nickname={formatNickname(donation.nickname)}
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

    const [donationsAmount, donationsCount] = +currentStatsPeriod // check if currentStatsPeriod is not ALLTIME
      ? getDonationsStatsByPeriod(
          donations,
          BigInt(Date.now() - +currentStatsPeriod), // currentStatsPeriod is period in ms as string
          BigInt(Date.now())
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

  const renderDonationsCharts = () => {
    if (isDonationsLoading) return <Loader size={40} />;
    if (isDonationsError) return <div>Error!</div>;
    if (!donations) return <div>No donations yet!</div>;

    return (
      <>
        <h2 className="mb-2 mt-4">Donations count</h2>
        <Chart donations={donations} period={currentChartsPeriod} />
        <h2 className="mb-2 mt-4">Donations amount</h2>
        <Chart donations={donations} period={currentChartsPeriod} amountMode />
      </>
    );
  };

  const openWidget = () =>
    window.open(
      routes.widget(recipientAddress),
      "Popup",
      "resizable, width=600, height=600"
    );

  return (
    <div className="flex w-full flex-col justify-between self-start lg:flex-row">
      <div className="flex min-w-[50%] flex-col items-center">
        <RecipientProfile
          avatarUrl={profile.avatarUrl}
          nickname={profile.nickname}
          address={recipientAddress}
          showAddress={!profile.nickname}
          shortAddress
        />
        <div className="flex flex-col items-center gap-2">
          <Link
            href={routes.donate(profile.nickname || recipientAddress)}
            target="_blank"
          >
            <Button text="Open donation page" size="small" />
          </Link>
          <Button text="Open widget" size="small" onClick={openWidget} />
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
        <div className="flex flex-col items-center pt-10">
          <div className="flex w-[17rem] items-center pb-4">
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
        <div className="flex w-full flex-col items-center pt-10">
          <div className="flex w-[17rem] items-center">
            <h2 className="text-center text-2xl font-semibold text-white">
              Dynamics
            </h2>
            <div className="ml-2">
              <Select
                options={DONATION_CHARTS_PERIOD_OPTIONS}
                selected={currentChartsPeriod}
                onSelect={setCurrentChartsPeriod}
              />
            </div>
          </div>
          {renderDonationsCharts()}
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
DashboardPage.requireAuth = true;

export default DashboardPage;
