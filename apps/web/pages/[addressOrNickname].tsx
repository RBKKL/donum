import React, { useState } from "react";
import { useRouter } from "next/router";
import { RecipientProfile } from "@components/RecipientProfile";
import { Input } from "@components/Input";
import { TextField } from "@components/TextField";
import { EthIcon } from "@components/icons/EthIcon";
import { useSendDonation } from "@hooks/useSendDonation";
import {
  DEFAULT_SHOW_AMOUNT,
  MESSAGE_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
} from "@donum/shared/constants";
import {
  formatAddress,
  formatTokenAmount,
  isNumber,
  isEthAddress,
} from "@donum/shared/helpers";
import { DonationModal } from "@components/DonationModal";
import { Address, useAccount, useBalance } from "wagmi";
import { Balance } from "@components/Balance";
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

interface ProfileProps {
  profile?: PopulatedProfile;
}

const SendDonationPage: NextPage<ProfileProps> = ({ profile }) => {
  const router = useRouter();
  const addressOrNickname = router.query.addressOrNickname as string;

  const recipientAddress = (profile?.address || addressOrNickname) as Address;
  const minShowAmount = profile?.minShowAmount || "0";

  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    watch: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [senderNickname, setSenderNickname] = useState("");
  const [donationAmount, setDonationAmount] = useState(
    ethers.formatEther(profile?.minShowAmount ?? DEFAULT_SHOW_AMOUNT)
  );
  const [message, setMessage] = useState("");

  const { donate, isAvailable, isLoading, isError } = useSendDonation(
    senderNickname,
    recipientAddress,
    donationAmount,
    message
  );

  const donationAmountBigInt = ethers.parseUnits(
    donationAmount,
    balanceData?.decimals
  );
  const isValidDonationAmount =
    isNumber(donationAmount) &&
    balanceData?.value &&
    balanceData.value > donationAmountBigInt &&
    donationAmountBigInt > 0n;

  const onDonationMessageChange = (message: string) => {
    setMessage(message);
  };

  const onSendBtnClick = () => {
    setIsModalOpen(true);
    donate();
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
        <p className="break-words px-4 pb-4 text-left text-sm">
          {profile.description}
        </p>
        <AmountInput
          value={donationAmount}
          downCorner={
            <div className="w-full text-left text-xs text-gray-400">
              Minimal amount to show donation:{" "}
              {formatTokenAmount(minShowAmount)}
            </div>
          }
          onChange={setDonationAmount}
          error={isConnected && !isValidDonationAmount}
          textSize="large"
          placeholder="0"
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
        <Input
          placeholder="Nickname..."
          value={senderNickname}
          onChange={setSenderNickname}
          textSize="large"
          maxLength={NICKNAME_MAX_LENGTH}
        />
        <TextField
          placeholder="Type your message here..."
          value={message}
          onChange={onDonationMessageChange}
          minRows={5}
          maxLength={MESSAGE_MAX_LENGTH}
          footer={
            <p className="flex flex-row-reverse text-xs text-gray-400">
              {message.length}/{MESSAGE_MAX_LENGTH}
            </p>
          }
        />
        <div className="flex flex-row-reverse">
          {isConnected ? (
            <Button
              text="Send"
              disabled={!isAvailable}
              onClick={onSendBtnClick}
            />
          ) : (
            <ConnectButton />
          )}
        </div>
      </div>
      <DonationModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        isError={isError}
        isLoading={isLoading}
        donationAmount={donationAmount}
        nickname={profile.nickname || formatAddress(profile.address)}
      />
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const addressOrNickname = (await context.query.addressOrNickname) as string;
  const isAddress = isEthAddress(addressOrNickname);

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

export default SendDonationPage;
