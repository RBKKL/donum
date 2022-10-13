import { NextPage } from "next";
import { useRouter } from "next/router";
import { DonationCard } from "@components";
import { useGetAllDonations } from "@hooks/useGetAllDonations";
import { reverseArray } from "@lib/helpers";

const DashboardPage: NextPage = () => {
  const router = useRouter();
  const recipientAddress = router.query.address as string;

  const { donations } = useGetAllDonations(recipientAddress);

  return (
    <div className="flex flex-col gap-3">
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
  );
};

export default DashboardPage;
