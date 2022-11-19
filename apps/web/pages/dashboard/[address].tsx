import { NextPage } from "next";
import { useRouter } from "next/router";
import { DonationCard } from "@components/DonationCard";
import { RecipientProfile } from "@components/RecipientProfile";
import { getTotalDonationsAmount, reverseArray } from "@lib/helpers";
import { useLiveDonationsHistory } from "@hooks/useLiveDonationsHistory";
import { Button } from "@components/Button";
import { EditIcon } from "@components/icons/EditIcon";
import Link from "next/link";
import { Loader } from "@components/Loader";

const DashboardPage: NextPage = () => {
  const editProfileButtonHandler = () => {
    console.log("edit profile button handler");
  };

  const router = useRouter();
  const recipientAddress = router.query.address as string;
  const { donations, isLoading, isError, error } =
    useLiveDonationsHistory(recipientAddress);

  if (isLoading) return <Loader />;

  if (isError) {
    console.error(error);
    return <div>Error!</div>;
  }

  return (
    <div className="flex w-full flex-col lg:flex-row justify-between self-start">
      <div className="flex flex-col items-center px-24">
        <RecipientProfile
          avatarPath="/assets/images/default_avatar.gif"
          nickname="Nix"
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
