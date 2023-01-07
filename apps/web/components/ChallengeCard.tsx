import { FC } from "react";
import { BigNumber } from "ethers";
import {
  formatAddress,
  formatTimestamp,
  formatTokenAmount,
} from "@donum/shared/helpers";
import { ChallengeStatus } from "@donum/shared/constants";
import classNames from "classnames";
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
  <div className="m my-3 flex w-[62vw] flex-col rounded-2xl bg-zinc-700 px-4 py-2 text-sm">
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
        <button
          onClick={() => {
            console.log("accepting challenge...");
          }}
          className={classNames(
            "px- bg-green mr-1.5 flex w-full items-center justify-center rounded-3xl py-2 px-8 font-semibold"
          )}
        >
          Confirm
        </button>
        <button
          onClick={() => {
            console.log("rejecting challenge...");
          }}
          className={classNames(
            "bg-red ml-1.5 flex w-full items-center justify-center rounded-3xl py-2 px-8 font-semibold"
          )}
        >
          Denay
        </button>
      </div>
    )}
  </div>
);
