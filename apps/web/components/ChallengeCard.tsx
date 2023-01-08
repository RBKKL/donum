import { FC } from "react";
import { BigNumber } from "ethers";
import {
  formatAddress,
  formatTimestamp,
  formatTokenAmount,
} from "@donum/shared/helpers";
import { ChallengeStatus } from "@donum/shared/constants";
import { Button } from "@components/Button";

interface ChallengeCardProps {
  from: string;
  nickname: string;
  timestamp: BigNumber;
  amount: BigNumber;
  message: string;
  status: ChallengeStatus;
}

export const ChallengeCard: FC<ChallengeCardProps> = ({
  from,
  nickname,
  timestamp,
  amount,
  message,
  status,
}) => (
  <div className="my-3 flex w-full flex-col rounded-2xl bg-zinc-700 px-4 py-2 text-sm">
    <div className="mb-2.5 flex justify-between text-white">
      <p className="font-medium">
        {nickname ? (
          <>
            <span>{nickname} </span>
            <span className="font-normal text-gray-400">
              ({formatAddress(from)})
            </span>
          </>
        ) : (
          <span>{formatAddress(from)}</span>
        )}
        <span className="font-normal"> sent </span>
        {formatTokenAmount(amount)} ETH
      </p>
      <p className="text-gray-400">{formatTimestamp(timestamp)}</p>
    </div>
    <p className="break-words-custom mb-2.5 text-neutral-50">{message}</p>
    {status === ChallengeStatus.DONE && (
      <div className="text-green flex justify-center text-xl font-semibold">
        Done
      </div>
    )}
    {status === ChallengeStatus.FAILED && (
      <div className="text-red flex justify-center text-xl font-semibold">
        Failed
      </div>
    )}
    {status === ChallengeStatus.WAITING && (
      <div className="flex flex-row justify-center text-xl">
        <Button
          text={"Confirm"}
          size={"normal"}
          fullWidth={true}
          color={"success"}
          className="mr-1.5"
          onClick={() => {
            console.log("accepting challenge...");
          }}
        />
        <Button
          text={"Denay"}
          size={"normal"}
          fullWidth={true}
          color={"error"}
          className="ml-1.5"
          onClick={() => {
            console.log("rejecting challenge...");
          }}
        />
      </div>
    )}
  </div>
);
