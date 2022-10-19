import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Button } from "@components/Button";
import { RecipientProfile } from "@components/RecipientProfile";
import { Input } from "@components/Input";
import { TextField } from "@components/TextField";
import { EthIcon } from "@components/icons/EthIcon";
import { useSendDonation } from "@hooks/useSendDonation";
import { MESSAGE_MAX_LENGTH } from "@lib/constants";
import { isNumber } from "@lib/helpers";
import { DonationModal } from "@components/DonationModal";

const DEFAULT_DONATION_AMOUNT = "0.001";

const SendDonationPage: NextPage = () => {
  const router = useRouter();
  const recipientAddress = router.query.address as string;
  // TODO: validate address
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nickname = "Nix";

  const [donationAmount, setDonationAmount] = useState(DEFAULT_DONATION_AMOUNT);
  const [message, setMessage] = useState("");

  const { donate, isAvailable, isLoading, isError } = useSendDonation(
    recipientAddress,
    donationAmount,
    message
  );

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
      <div className="flex flex-col w-full sm:max-w-lg pt-12 gap-4">
        <Input
          value={donationAmount}
          onChange={onDonationAmountChange}
          onBlur={setMinimumAmount}
          rightCorner={<EthIcon />}
        />
        <TextField
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
        <div className="flex flex-row-reverse">
          <Button
            text="Send"
            disabled={!isAvailable || Number(donationAmount) === 0}
            onClick={onSendBtnClick}
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
