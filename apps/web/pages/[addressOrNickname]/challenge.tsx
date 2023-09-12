import React, { useState } from "react";
import { useRouter } from "next/router";
import { RecipientProfile } from "@components/RecipientProfile";
import { Input } from "@components/Input";
import { TextField } from "@components/TextField";
import { EthIcon } from "@components/icons/EthIcon";
import {
  CHALLENGE_MAX_LENGTH,
  DEFAULT_SHOW_AMOUNT,
  NICKNAME_MAX_LENGTH,
} from "@donum/shared/constants";
import {
  formatAddress,
  formatTokenAmount,
  isNumber,
} from "@donum/shared/helpers";
import { Address, useAccount, useBalance } from "wagmi";
import { Balance } from "@components/Balance";
import { parseUnits } from "ethers/lib/utils";
import { Button } from "@components/Button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import {
  PopulatedProfile,
  populateProfileWithDefaultValues,
} from "@lib/profile";
import { prisma } from "@donum/prisma";
import type { GetServerSidePropsContext, NextPage } from "next";
import { AmountInput } from "@components/AmountInput";
import { useProposeChallenge } from "@hooks/useProposeChallenge";
import { ChallengeModal } from "@components/ChallengeModal";
import { routes } from "@lib/routes";

interface ProfileProps {
  profile?: PopulatedProfile;
}

const SendChallengePage: NextPage<ProfileProps> = ({ profile }) => {
  const router = useRouter();
  const addressOrNickname = router.query.addressOrNickname as string;

  const recipientAddress = (profile?.address || addressOrNickname) as Address;
  const proposalPrice = ethers.utils.formatEther(profile?.minShowAmount || "0");

  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    watch: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [senderNickname, setSenderNickname] = useState("");
  const [awardAmount, setAwardAmount] = useState("");
  const [terms, setTerms] = useState("");

  const { proposeChallenge, isAvailable, isLoading, isError } =
    useProposeChallenge(
      senderNickname,
      recipientAddress,
      proposalPrice,
      terms,
      awardAmount
    );

  // TODO: учитывать не только award amount, но и minShowAmount
  const isValidAwardAmount =
    isNumber(awardAmount) &&
    balanceData?.value?.gt(parseUnits(awardAmount, balanceData.decimals)) &&
    parseUnits(awardAmount, balanceData.decimals).gte(0);

  const onTermsMessageChange = (message: string) => {
    setTerms(message);
  };

  const onChallengeBtnClick = () => {
    setIsModalOpen(true);
    proposeChallenge();
  };

  if (!profile) {
    return <div>No profile with such nickname: {addressOrNickname}</div>;
  }

  return (
    <div className="flex w-full flex-col items-center text-center">
      <RecipientProfile
        avatarUrl={profile.avatarUrl}
        nickname={profile.nickname}
        address={recipientAddress}
        shortAddress
      />
      <div className="flex w-full flex-col gap-4 pt-2 sm:max-w-4xl">
        <p className="break-words pb-2 text-left text-sm">
          {profile.description}
        </p>
        <p className="break-words pb-2 text-left text-lg">
          Challenge proposal price:{" "}
          {formatTokenAmount(profile?.minShowAmount || DEFAULT_SHOW_AMOUNT)} ETH
        </p>
        <Input
          placeholder="Anonymous"
          value={senderNickname}
          onChange={setSenderNickname}
          textSize="large"
          maxLength={NICKNAME_MAX_LENGTH}
        />
        <TextField
          placeholder="Type your terms here..."
          value={terms}
          onChange={onTermsMessageChange}
          minRows={5}
          maxLength={CHALLENGE_MAX_LENGTH}
          footer={
            <p className="flex flex-row-reverse text-xs text-gray-400">
              {terms.length}/{CHALLENGE_MAX_LENGTH}
            </p>
          }
        />
        <AmountInput
          value={awardAmount}
          onChange={setAwardAmount}
          error={awardAmount !== "" && isConnected && !isValidAwardAmount}
          textSize="large"
          placeholder="Award amount..."
          rightCorner={
            <div className="flex flex-col items-end">
              <EthIcon />
              {balanceData && (
                <Balance
                  balance={formatTokenAmount(
                    balanceData.value,
                    balanceData.decimals
                  )}
                />
              )}
            </div>
          }
        />
        <div className="flex flex-row-reverse">
          {isConnected ? (
            <Button
              text="Challenge"
              disabled={!isAvailable}
              onClick={onChallengeBtnClick}
            />
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
      <ChallengeModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        isError={isError}
        isLoading={isLoading}
        proposalPrice={proposalPrice}
        awardAmount={awardAmount}
        nickname={profile.nickname || formatAddress(profile.address)}
        onSuccess={() => router.push(routes.challenges)}
      />
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const addressOrNickname = (await context.query.addressOrNickname) as string;
  const isAddress = ethers.utils.isAddress(addressOrNickname);

  const searchBy = isAddress ? "address" : "nickname";
  const prismaProfile = await prisma.profile.findFirst({
    where: { [searchBy]: addressOrNickname },
  });

  // if nickname is provided and there is no profile with such nickname - return empty props
  if (!prismaProfile && !isAddress) {
    return {
      props: {},
    };
  }

  // else there is a profile with such nickname or address is provided, so return populated profile
  return {
    props: {
      profile: populateProfileWithDefaultValues(
        prismaProfile ?? {
          address: addressOrNickname,
        }
      ),
    },
  };
}

export default SendChallengePage;
