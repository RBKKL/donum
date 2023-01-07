import React from "react";
import { ChallengeStatus } from "@donum/shared/constants";
import { BigNumber } from "ethers";
import type { NextPage } from "next";
import { ChallengeCard } from "@components/ChallengeCard";

const SentChallengesPage: NextPage = () => {
  return (
    <div className="items-start">
      <div className="pb-2 text-center text-2xl font-semibold">
        Sent challenges
      </div>
      <div className="flex flex-col">
        <ChallengeCard
          key={1}
          from={"0x5FbD1231230aa3"}
          nickname={"RichDonater"}
          timestamp={BigNumber.from("228228228228")}
          amount={BigNumber.from("1000000000000000")}
          message={
            "100 процентов людей, сидящих в этом зале, не знают, кто я такой. И это хорошо. Это правильно. Год назад я жил на окраине Академа. В крохотном общежитии с тараканами, клопами и одинокой мышью в духовке, а моим соседом был татуировщик Саня из Северобайкальск"
          }
          status={ChallengeStatus.WAITING}
        />
        <ChallengeCard
          key={1}
          from={"0x5FbD1231230aa3"}
          nickname={"RichDonater"}
          timestamp={BigNumber.from("228228228228")}
          amount={BigNumber.from("1000000000000000")}
          message={
            "100 процентов людей, сидящих в этом зале, не знают, кто я такой. И это хорошо. Это правильно. Год назад я жил на окраине Академа. В крохотном общежитии с тараканами, клопами и одинокой мышью в духовке, а моим соседом был татуировщик Саня из Северобайкальск"
          }
          status={ChallengeStatus.FAILED}
        />
        <ChallengeCard
          key={1}
          from={"0x5FbD1231230aa3"}
          nickname={"RichDonater"}
          timestamp={BigNumber.from("228228228228")}
          amount={BigNumber.from("1000000000000000")}
          message={
            "100 процентов людей, сидящих в этом зале, не знают, кто я такой. И это хорошо. Это правильно. Год назад я жил на окраине Академа. В крохотном общежитии с тараканами, клопами и одинокой мышью в духовке, а моим соседом был татуировщик Саня из Северобайкальск"
          }
          status={ChallengeStatus.DONE}
        />
        <ChallengeCard
          key={1}
          from={"0x5FbD1231230aa3"}
          nickname={"RichDonater"}
          timestamp={BigNumber.from("228228228228")}
          amount={BigNumber.from("1000000000000000")}
          message={
            "100 процентов людей, сидящих в этом зале, не знают, кто я такой. И это хорошо. Это правильно. Год назад я жил на окраине Академа. В крохотном общежитии с тараканами, клопами и одинокой мышью в духовке, а моим соседом был татуировщик Саня из Северобайкальск"
          }
          status={ChallengeStatus.WAITING}
        />
      </div>
    </div>
  );
};

export default SentChallengesPage;
