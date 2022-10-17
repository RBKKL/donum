import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Button, RecipientProfile, Input, TextField } from "@components";
import { EthIcon } from "@components/icons";
import { useDonateContractFn } from "@hooks/useDonateContractFn";
import { MESSAGE_MAX_LENGTH } from "@lib/constants";
import { isNumber } from "@lib/helpers";
import Image from "next/image";
import { StyledModal } from "@components/Modal";

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
      <StyledModal
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        title={isError ? "Error" : ""}
      >
        {isLoading ? (
          <div>
            <div className="flex py-8 justify-center mb-3">
              <Image className="animate-spin" src="/assets/svg/loader.svg" layout="fixed" width={90} height={90} />
            </div>
            <div className="flex flex-col w-full items-center">
              <p className="mb-1 text-lg font-semibold">Waiting for confirmation</p>
              <p className="mb-2 text-lg font-semibold">Donating {donationAmount} ETH to {nickname}</p>
              <p className="mb-2 text-xs">Confirm this transaction in your wallet</p>
            </div>
          </div>
        ) : (
          isError ? (
            <div>
              <div className="flex flex-col py-8 justify-center items-center">
                <Image src="/assets/svg/warning.svg" layout="fixed" width={90} height={90} />
                <p className="mt-5 text-lg font-semibold">Transaction rejected</p>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                text="Dismiss"
                fullWidth
              />
            </div>
          ) : (
            <div>
              <div className="flex flex-col py-8 justify-center items-center">
                <Image src="/assets/svg/arrow.svg" layout="fixed" width={90} height={90} />
                <p className="mt-5 text-lg font-semibold">Transaction submitted</p>
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                text="Close"
                fullWidth
              />
            </div>
          ))}
      </StyledModal>
    </div>
  );
};

export default SendDonationPage;
