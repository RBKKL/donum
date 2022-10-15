import { FC } from "react";
import { BigNumber, ethers } from "ethers";
import {formatAddress} from "@lib/helpers";

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
  // TODO: fix width))
  <div className="rounded-2xl bg-zinc-700 px-4 py-2 self-stretch text-sm w-1/2">
    <div className="flex justify-between mb-2.5 font-roboto">
      <p className="font-inter">
        {formatAddress(from)} sent {ethers.utils.formatEther(amount)} ETH
      </p>
      <p className="text-gray-400">{new Date(timestamp.mul(1000).toNumber()).toLocaleString()}</p>
    </div>
    <p>{message}</p>
  </div>
);
