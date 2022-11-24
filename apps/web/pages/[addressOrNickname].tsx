import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { RecipientProfile } from "@components/RecipientProfile";
import { Input } from "@components/Input";
import { TextField } from "@components/TextField";
import { EthIcon } from "@components/icons/EthIcon";
import { useSendDonation } from "@hooks/useSendDonation";
import {
  DEFAULT_DONATION_AMOUNT,
  MESSAGE_MAX_LENGTH,
} from "@donum/shared/constants";
import { formatTokenAmount, isNumber } from "@donum/shared/helpers";
import { DonationModal } from "@components/DonationModal";
import { Address, useAccount, useBalance } from "wagmi";
import { Balance } from "@components/Balance";
import { parseUnits } from "ethers/lib/utils";
import { Button } from "@components/Button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { trpc } from "@lib/trpc";
import { Loader } from "@components/Loader";

const SendDonationPage: NextPage = () => {
  const router = useRouter();
  const addressOrNickname = router.query.addressOrNickname as string;
  const isAddress = ethers.utils.isAddress(addressOrNickname);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = isAddress
    ? trpc.profile.byAddress.useQuery({
        address: addressOrNickname,
      })
    : trpc.profile.byNickname.useQuery({
        nickname: addressOrNickname,
      });

  const recipientAddress = (profile?.address || addressOrNickname) as Address;
  const minShowAmount = profile?.minShowAmount || "0";

  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
    watch: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [donationAmount, setDonationAmount] = useState(DEFAULT_DONATION_AMOUNT);
  const [message, setMessage] = useState("");

  const { donate, isAvailable, isLoading, isError } = useSendDonation(
    recipientAddress,
    donationAmount,
    message
  );

  if (isProfileLoading) return <Loader />;

  if (isProfileError) {
    console.log(profileError);
    return <div>Error!</div>;
  }

  if (!profile) {
    return <div>No such profile: {addressOrNickname}</div>;
  }

  const isValidDonationAmount =
    isNumber(donationAmount) &&
    balanceData?.value?.gt(parseUnits(donationAmount, balanceData.decimals)) &&
    parseUnits(donationAmount, balanceData.decimals).gt(0);

  const onDonationAmountChange = (amount: string) =>
    (isNumber(amount) || amount == "") && setDonationAmount(amount);

  const onDonationMessageChange = (message: string) => {
    setMessage(message);
  };

  const setMinimumAmount = () => {
    if (!donationAmount || Number(donationAmount) === 0) {
      setDonationAmount("0.0");
    }
  };

  const onSendBtnClick = () => {
    setIsModalOpen(true);
    donate();
  };

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
        <Input
          value={donationAmount}
          downCorner={
            <div className="w-full text-left text-xs text-gray-400">
              Minimal amount to show donation:{" "}
              {formatTokenAmount(minShowAmount)}
            </div>
          }
          onChange={onDonationAmountChange}
          onBlur={setMinimumAmount}
          error={isConnected && !isValidDonationAmount}
          textSize="large"
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
        nickname={profile.nickname || profile.address}
      />
    </div>
  );
};

export default SendDonationPage;
