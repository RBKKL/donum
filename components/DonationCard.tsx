import { FC } from "react";
import { BigNumber, ethers } from "ethers";

interface DonationCardProps {
  from: string;
  timestamp: BigNumber;
  amount: BigNumber;
  message: string;
}

export const DonationCard: FC<DonationCardProps> = ({
  from,
  timestamp,
  amount,
  message,
}) => (
  <div>
    <p>
      {from} sent {ethers.utils.formatEther(amount)} ETH
    </p>
    <p>{new Date(timestamp.mul(1000).toNumber()).toLocaleString()}</p>
    <p>{message}</p>
  </div>
);
