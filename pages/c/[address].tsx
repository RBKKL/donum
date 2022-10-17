import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Button, RecipientProfile, Input, TextField } from "@components";
import { EthIcon } from "@components/icons";
import { useDonateContractFn } from "@hooks/useDonateContractFn";
import { MESSAGE_MAX_LENGTH } from "@lib/constants";
import { isNumber } from "@lib/helpers";

const SendDonationPage: NextPage = () => {
  const router = useRouter();
  const recipientAddress = router.query.address as string;
  // TODO: validate address

  const [donationAmount, setDonationAmount] = useState("0.001");
  // TODO: validate amount
  const [message, setMessage] = useState("");

  const { donate, isAvailable } = useDonateContractFn(
    recipientAddress,
    donationAmount,
    message
  );

  const onDonationAmountChange = (amount: string) =>
    isNumber(amount) && setDonationAmount(amount);

  const onDonationMessageChange = (message: string) => {
    setMessage(message);
  };

  return (
    <div className="flex flex-col items-center text-center">
      <RecipientProfile
        avatarPath="/assets/images/default_avatar.gif"
        nickname="Nix"
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
    </div>
  );
};

export default SendDonationPage;
