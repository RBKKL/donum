import { FC } from "react";
import { BigNumber, ethers } from "ethers";
import {formatAddress} from "@lib/helpers";
import { format } from "date-fns";

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
  <div className="rounded-2xl bg-zinc-700 px-4 py-2 text-sm">
    <div className="flex mb-2.5 font-roboto justify-between text-white">
      <p className="font-inter">
        {formatAddress(from, 6, 4)} sent {ethers.utils.formatEther(amount)} ETH
      </p>
      <p className="text-gray-400">
        { format(new Date(timestamp.mul(1000).toNumber()), "d MMMM yy  k:m")}
      </p>
    </div>
    <p className="break-words text-neutral-50">{message}</p>
  </div>
);
