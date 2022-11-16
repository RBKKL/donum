import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { RecipientProfile } from "@components/RecipientProfile";
import { Input } from "@components/Input";
import { TextField } from "@components/TextField";
import { EthIcon } from "@components/icons/EthIcon";
import { useSendDonation } from "@hooks/useSendDonation";
import { MESSAGE_MAX_LENGTH } from "shared/constants";
import { formatBalance, isNumber } from "@lib/helpers";
import { DonationModal } from "@components/DonationModal";
import { Address, useAccount, useBalance } from "wagmi";
import { Balance } from "@components/Balance";
import { parseUnits } from "ethers/lib/utils";
import { SendDonationButton } from "@components/SendDonationButton";

const DEFAULT_DONATION_AMOUNT = "0.001";

const SendDonationPage: NextPage = () => {
  const router = useRouter();
  const recipientAddress = router.query.address as Address; // TODO: validate address

  const { address, isDisconnected } = useAccount();
  const { data: balanceData } = useBalance({
    addressOrName: address,
    watch: true,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const nickname = "Nix";

  const [donationAmount, setDonationAmount] = useState(DEFAULT_DONATION_AMOUNT);
  const [message, setMessage] = useState("");

  const { donate, isAvailable, isLoading, isError } = useSendDonation(
    recipientAddress,
    donationAmount,
    message
  );
  const isValidDonationAmount =
    balanceData?.value?.gt(parseUnits(donationAmount, balanceData.decimals)) &&
    parseUnits(donationAmount, balanceData.decimals).gt(0);

  const onDonationAmountChange = (amount: string) =>
    isNumber(amount) && setDonationAmount(amount);

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
    <div className="flex flex-col items-center text-center">
      <RecipientProfile
        avatarPath="/assets/images/default_avatar.gif"
        nickname={nickname}
        address={recipientAddress}
      />
      <div className="flex w-full flex-col gap-4 pt-2 sm:max-w-4xl">
        <p className="break-words px-4 pb-4 text-left text-sm">description</p>
        <Input
          value={donationAmount}
          onChange={onDonationAmountChange}
          onBlur={setMinimumAmount}
          error={!isDisconnected && !isValidDonationAmount}
          rightCorner={
            <div className="flex flex-col items-end">
              <EthIcon />
              {balanceData && <Balance balance={formatBalance(balanceData)} />}
            </div>
          }
        />
        <div className="flex h-full w-full flex-col rounded-2xl bg-zinc-700 p-4">
          <TextField
            placeholder="Type your message here..."
            value={message}
            onChange={onDonationMessageChange}
            minRows={6}
            maxLength={MESSAGE_MAX_LENGTH}
            footer={
              <p className="flex flex-row-reverse text-xs text-gray-400">
                {message.length}/{MESSAGE_MAX_LENGTH}
              </p>
            }
          />
        </div>
        <div className="flex flex-row-reverse">
          <SendDonationButton
            isSendButtonDisabled={!isAvailable || Number(donationAmount) === 0}
            isConnectButton={isDisconnected}
            onSendButtonClick={onSendBtnClick}
          />
        </div>
      </div>
      <DonationModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        isError={isError}
        isLoading={isLoading}
        donationAmount={donationAmount}
        nickname={nickname}
      />
    </div>
  );
};

export default SendDonationPage;
