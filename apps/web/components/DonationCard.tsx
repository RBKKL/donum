import { FC } from "react";
import { BigNumber } from "ethers";
import {
  formatAddress,
  formatTimestamp,
  formatTokenAmount,
} from "@donum/shared/helpers";

interface DonationCardProps {
  from: string;
  nickname: string;
  timestamp: BigNumber;
  amount: BigNumber;
  message: string;
}

export const DonationCard: FC<DonationCardProps> = ({
  from,
  nickname,
  timestamp,
  amount,
  message,
}) => (
  <div className="my-3 w-full rounded-2xl bg-zinc-700 px-4 py-2 text-sm">
    <div className="mb-2.5 flex justify-between text-white">
      <p className="font-medium">
        {nickname ? (
          <>
            <span>{nickname} </span>
            <span className="text-gray-400">({formatAddress(from)})</span>
          </>
        ) : (
          <span>{formatAddress(from)}</span>
        )}
        <span className="font-normal"> sent </span>
        {formatTokenAmount(amount)} ETH
      </p>
      <p className="text-gray-400">{formatTimestamp(timestamp)}</p>
    </div>
    <p className="break-words-custom text-neutral-50">{message}</p>
  </div>
);
