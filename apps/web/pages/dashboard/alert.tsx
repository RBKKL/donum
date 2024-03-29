import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { parseEther } from "viem";
import { MESSAGE_MAX_LENGTH } from "@donum/shared/constants";
import { isNumber } from "@donum/shared/helpers";
import { Button } from "~/components/Button";
import { EthIcon } from "~/components/icons/EthIcon";
import { Input } from "~/components/Input";
import { Loader } from "~/components/Loader";
import { RecipientProfile } from "~/components/RecipientProfile";
import { TextField } from "~/components/TextField";
import { trpc } from "~/lib/trpc";
import type { ExtendedNextPage } from "~/pages/_app";

const CustomTestDonationPage: ExtendedNextPage = () => {
  const { data: session } = useSession();

  // NOTE: session can't be null here, because it's secured page and Layout will show warning
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const address = session!.user.address;

  const [senderNickname, setSenderNickname] = useState("");
  const [message, setMessage] = useState("");
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = trpc.profile.byAddress.useQuery({
    address,
  });
  // TODO: abstract amount handling to custom hook
  const [amount, setAmount] = useState("0.01");

  const sendTestDonation = trpc.donation.sendTestDonation.useMutation();

  if (isLoading) return <Loader />;

  if (isError) {
    console.error(`Error while fetching profile: ${error}`);
    return <div>Error!</div>;
  }

  const onAmountChange = (amount: string) =>
    isNumber(amount) && setAmount(amount);

  const setMinimumAmount = () => {
    if (!amount || Number(amount) === 0) {
      setAmount("0.0");
    }
  };

  return (
    <div className="flex w-full flex-col items-center text-center">
      <RecipientProfile
        avatarUrl={profile.avatarUrl}
        nickname={profile.nickname}
        address={address}
        shortAddress
      />
      <div className="flex w-full flex-col gap-4 pt-2 sm:max-w-4xl">
        <p className="break-words px-4 pb-4 text-left text-sm">
          {profile.description}
        </p>
        <Input
          value={amount}
          onChange={onAmountChange}
          onBlur={setMinimumAmount}
          textSize="large"
          rightCorner={
            <div className="flex flex-col items-end">
              <EthIcon />
            </div>
          }
        />
        <Input
          placeholder="Your nickname"
          value={senderNickname}
          onChange={setSenderNickname}
          textSize="large"
        />
        <TextField
          placeholder="Type your message here..."
          value={message}
          onChange={setMessage}
          minRows={5}
          maxLength={MESSAGE_MAX_LENGTH}
          footer={
            <p className="flex flex-row-reverse text-xs text-gray-400">
              {message.length}/{MESSAGE_MAX_LENGTH}
            </p>
          }
        />
        <div className="flex flex-row-reverse">
          <Button
            text="Send test donation"
            onClick={() =>
              sendTestDonation.mutate({
                nickname: senderNickname,
                amount: parseEther(amount),
                message,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};
CustomTestDonationPage.requireAuth = true;

export default CustomTestDonationPage;
