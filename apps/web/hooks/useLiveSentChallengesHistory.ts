import { useEffect, useState } from "react";
import { useSentChallengesHistory } from "@hooks/useSentChallengesHistory";
import { useChallengeProposedEvent } from "@hooks/useChallengeProposedEvent";
import { ChallengeStatus } from "@donum/shared/constants";
import { useChallengeCompletedEvent } from "@hooks/useChallengeCompletedEvent";
import { useChallengeFailedEvent } from "@hooks/useChallengeFailedEvent";

export const useLiveSentChallengesHistory = (senderAddress: string) => {
  const [challenges, setChallenges] = useState<readonly unknown[]>([]);

  const {
    data: initialChallenges,
    isLoading,
    isError,
    error,
  } = useSentChallengesHistory(senderAddress);

  useEffect(() => {
    setChallenges(initialChallenges || []);
  }, [initialChallenges]);

  useChallengeProposedEvent((challenge) => {
    if (challenge.from === senderAddress) {
      setChallenges([
        ...challenges,
        {
          to: challenge.to,
          award: challenge.award,
          terms: challenge.terms,
          timestamp: challenge.timestamp,
          status: ChallengeStatus.WAITING,
        },
      ]);
    }
  });

  useChallengeCompletedEvent((challenge) => {
    if (challenge.from === senderAddress) {
      challenges[challenge.index.toNumber()].status = ChallengeStatus.DONE;
      setChallenges(challenges);
    }
  });

  useChallengeFailedEvent((challenge) => {
    if (challenge.from === senderAddress) {
      challenges[challenge.index.toNumber()].status = ChallengeStatus.FAILED;
      setChallenges(challenges);
    }
  });

  return { challenges, isLoading, isError, error };
};
