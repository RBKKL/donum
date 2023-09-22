import React, { useState } from "react";
import type { GetServerSidePropsContext, NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMountedState } from "react-use";
import { Address, formatUnits, parseUnits } from "viem";
import { useAccount, useBalance } from "wagmi";
import { prisma } from "@donum/prisma";
import {
  MESSAGE_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
} from "@donum/shared/constants";
import {
  formatAddress,
  formatTokenAmount,
  isNumber,
} from "@donum/shared/helpers";
import {
  getPopulatedProfileByAddressOrNickname,
  type PopulatedProfile,
} from "@donum/trpc/server/routers/profile";
import { AmountInput } from "~/components/AmountInput";
import { Button } from "~/components/Button";
import { DonationModal } from "~/components/DonationModal";
import { EthIcon } from "~/components/icons/EthIcon";
import { Input } from "~/components/Input";
import { RecipientProfile } from "~/components/RecipientProfile";
import { TextField } from "~/components/TextField";
import { useSendDonation } from "~/hooks/useSendDonation";

const Balance = dynamic(
  () => import("~/components/Balance").then((mod) => mod.Balance),
  {
    ssr: false,
  }
);

interface ProfileProps {
  profile: PopulatedProfile;
}

const getParam = (param: string | string[] | undefined): string | undefined => {
  return Array.isArray(param) ? param[0] : param;
};

const SendDonationPage: NextPage<ProfileProps> = ({ profile }) => {
  const router = useRouter();
  const addressOrNickname = getParam(router.query.addressOrNickname) as string; // wont be undefined because of the route

  const recipientAddress = profile.address as Address;
  const minShowAmount = profile.minShowAmount || "0";

  const isMounted = useMountedState();
  const { address, isConnected: isConnectedOnClient } = useAccount();
  const isConnected = isMounted() && isConnectedOnClient;
  const { data: balanceData } = useBalance({
    address,
    watch: true,
  });
  const decimals = balanceData?.decimals || 18;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [senderNickname, setSenderNickname] = useState("");
  const [message, setMessage] = useState("");
  // TODO: abstract amount handling to custom hook
  const [donationAmount, setDonationAmount] = useState(
    formatUnits(profile.minShowAmount, decimals)
  );
  const donationAmountBigInt = parseUnits(donationAmount, decimals);

  const { donate, isAvailable, isLoading, isError } = useSendDonation(
    senderNickname,
    recipientAddress,
    donationAmountBigInt,
    message
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
        donationAmount={donationAmountBigInt}
        nickname={profile.nickname || formatAddress(profile.address)}
      />
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const addressOrNickname = getParam(
    context.params?.addressOrNickname
  ) as string; // wont be undefined because of the route

  const profile = await getPopulatedProfileByAddressOrNickname(prisma, {
    addressOrNickname,
  });

  if (!profile) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      profile,
    },
  };
}

export default SendDonationPage;
