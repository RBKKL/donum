import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Button, RecipientProfile, Input, TextField } from "@components";
import { EthIcon } from "@components/icons";
import { useDonateContractFn } from "@hooks/useDonateContractFn";
import { MESSAGE_MAX_LENGTH } from "@lib/constants";
import { isNumber } from "@lib/helpers";
import { DonationModal } from "@components/DonationModal";

const SendDonationPage: NextPage = () => {
  const router = useRouter();
  const recipientAddress = router.query.address as string;
  // TODO: validate address
  const [isOpen, setIsOpen] = useState(false);
  const nickname = "Nix";

  const [donationAmount, setDonationAmount] = useState("0.001");
  // TODO: validate amount
  const [message, setMessage] = useState("");

  const { donate, data, isAvailable, isLoading, isError } = useDonateContractFn(
    recipientAddress,
    donationAmount,
    message
  );

  useEffect(() => {
    if (isLoading || isError || data) {
      setIsOpen(true);
    }
  }, [isLoading, isError, data]);

  const onDonationAmountChange = (amount: string) =>
    isNumber(amount) && setDonationAmount(amount);

  const onDonationMessageChange = (message: string) => {
    setMessage(message);
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
          rightCorner={<EthIcon />}
        />
        <TextField
          value={message}
          onChange={onDonationMessageChange}
          minRows={4}
          maxLength={MESSAGE_MAX_LENGTH}
          footer={
            <p className="flex flex-row-reverse text-xs text-gray-400">
              {message.length}/{MESSAGE_MAX_LENGTH}
            </p>
          }
        />
        <div className="flex flex-row-reverse">
          <Button text="Send" disabled={!isAvailable || Number(donationAmount) === 0} onClick={donate} />
        </div>
      </div>
      <DonationModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isError={isError}
        isLoading={isLoading}
        donationAmount={donationAmount}
        nickname={nickname}
      />
    </div>
  );
};

export default SendDonationPage;
