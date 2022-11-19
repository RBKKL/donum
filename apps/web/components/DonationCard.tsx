import { FC } from "react";
import { BigNumber, ethers } from "ethers";
import { formatAddress } from "shared/helpers";
import { formatTimestamp } from "shared/helpers";

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
  <div className="my-3 rounded-2xl bg-zinc-700 px-4 py-2 text-sm">
    <div className="mb-2.5 flex justify-between text-white">
      <p className="font-medium">
        {formatAddress(from)}
        <span className="font-normal"> sent </span>
        {ethers.utils.formatEther(amount)} ETH
      </p>
      <p className="text-gray-400">{formatTimestamp(timestamp)}</p>
    </div>
    <p className="break-words text-neutral-50">{message}</p>
  </div>
);
