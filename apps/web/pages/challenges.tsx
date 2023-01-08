import React from "react";
import { ChallengeCard } from "@components/ChallengeCard";
import type { ExtendedNextPage } from "./_app";
import { useSentChallengesHistory } from "@hooks/useSentChallengesHistory";
import { Loader } from "@components/Loader";
import { trpc } from "@lib/trpc";
import { BigNumber } from "ethers";

const SentChallengesPage: ExtendedNextPage = () => {
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = trpc.profile.me.useQuery();

  const senderAddress = profile?.address || "";

  const {
    data: challenges,
    isLoading,
    isError,
    error,
  } = useSentChallengesHistory(senderAddress);

  if (isLoading || isProfileLoading) return <Loader />;

  if (isError || isProfileError) {
    console.log(error);
    console.log(profileError);
    return <div>Error!</div>;
  }

  return (
    <div className="items-start">
      <div className="pb-2 text-center text-2xl font-semibold">
        Sent challenges
      </div>
      <div className="flex w-full max-w-3xl flex-col gap-4">
        {challenges?.map((challenge, index) => (
          <ChallengeCard
            key={index}
            index={BigNumber.from(index)}
            from={senderAddress}
            nickname={profile.nickname}
            timestamp={challenge.timestamp}
            amount={challenge.award}
            message={challenge.terms}
            status={challenge.status}
          />
        ))}
      </div>
    </div>
  );
};
SentChallengesPage.requireAuth = true;

export default SentChallengesPage;
