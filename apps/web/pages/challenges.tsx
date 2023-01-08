import React from "react";
import { BigNumber } from "ethers";
import { ChallengeStatus } from "@donum/shared/constants";
import { ChallengeCard } from "@components/ChallengeCard";
import type { ExtendedNextPage } from "./_app";

const SentChallengesPage: ExtendedNextPage = () => {
  const challenges = [
    {
      donatorAddress: "0x5FbD1231230aa3",
      donatorNickname: "Вова",
      timestamp: BigNumber.from("228228228228"),
      amount: BigNumber.from("228228228228228228"),
      message: "Написай в бутылку из-под фанты",
      status: ChallengeStatus.DONE,
    },
    {
      donatorAddress: "0x1Gf32234128ab8",
      donatorNickname: "RichDonater",
      timestamp: BigNumber.from("228228228228"),
      amount: BigNumber.from("13371337133713371337"),
      message:
        "100 процентов людей, сидящих в этом зале, не знают, кто я такой. И это хорошо. Это правильно. Год назад я жил на окраине Академа. В крохотном общежитии с тараканами, клопами и одинокой мышью в духовке, а моим соседом был татуировщик Саня из Северобайкальск",
      status: ChallengeStatus.FAILED,
    },
    {
      donatorAddress: "0x1HGJ1234ac4",
      donatorNickname: "Саня",
      timestamp: BigNumber.from("228228228228"),
      amount: BigNumber.from("6969696969696969696969"),
      message: "Поцелуй учительницу",
      status: ChallengeStatus.WAITING,
    },
  ];

  return (
    <div className="items-start">
      <div className="pb-2 text-center text-2xl font-semibold">
        Sent challenges
      </div>
      <div className="flex w-full max-w-3xl flex-col gap-4">
        {challenges.map((challenge, index) => (
          <ChallengeCard
            key={index}
            from={challenge.donatorAddress}
            nickname={challenge.donatorNickname}
            timestamp={challenge.timestamp}
            amount={challenge.amount}
            message={challenge.message}
            status={challenge.status}
          />
        ))}
      </div>
    </div>
  );
};
SentChallengesPage.requireAuth = true;

export default SentChallengesPage;
