import { useEffect, useState } from "react";
import { useSentChallengesHistory } from "@hooks/useSentChallengesHistory";
import { useChallengeProposedEvent } from "@hooks/useChallengeProposedEvent";
import { ChallengeStatus } from "@donum/shared/constants";
import { useChallengeCompletedEvent } from "@hooks/useChallengeCompletedEvent";
import { useChallengeFailedEvent } from "@hooks/useChallengeFailedEvent";
import type { BigNumber } from "ethers";
import type { Address } from "wagmi";

export const useLiveSentChallengesHistory = (senderAddress: string) => {
  const [challenges, setChallenges] = useState<
    // TODO: change this
    readonly {
      nickname: string;
      to: Address;
      timestamp: BigNumber;
      terms: string;
      award: BigNumber;
      status: number;
    }[]
  >([]);

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
          to: challenge.to as Address,
          nickname: challenge.nickname,
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
      setChallenges(
        challenges.map((c, idx) => {
          if (idx === challenge.index.toNumber()) {
            return {
              ...c,
              status: ChallengeStatus.DONE,
            };
          }

          return c;
        })
      );
    }
  });

  useChallengeFailedEvent((challenge) => {
    if (challenge.from === senderAddress) {
      setChallenges(
        challenges.map((c, idx) => {
          if (idx === challenge.index.toNumber()) {
            return {
              ...c,
              status: ChallengeStatus.FAILED,
            };
          }

          return c;
        })
      );
    }
  });

  return { challenges, isLoading, isError, error };
};
