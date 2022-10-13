import { NextPage } from "next";
import { useGetAllDonations } from "@hooks/useGetAllDonations";
import { useRouter } from "next/router";
import { ethers } from "ethers";

const StatisticsPage : NextPage = () => {
  const router = useRouter();
  const recipientAddress = router.query.address as string;

  const donations = useGetAllDonations(recipientAddress);

  return (
    <div>
      {donations?.map((donation) =>
          <div className="mb-3">
            <p>{new Date(donation.timestamp * 1000).toLocaleString()}</p>
            <p>{ethers.utils.formatEther(donation.amount)} ETH</p>
            <p>{donation.message}</p>
          </div>
        )}
    </div>
  );
}

export default StatisticsPage;