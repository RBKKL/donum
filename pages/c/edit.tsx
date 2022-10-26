import type { NextPage } from "next";
import { Button } from "@components/Button";
import { RecipientProfile } from "@components/RecipientProfile";
import { TextField } from "@components/TextField";
import { DESCRIPTION_MAX_LENGTH } from "@lib/constants";
import { useState } from "react";
import { useAccount } from "wagmi";

const SendDonationPageEdit: NextPage = () => {
  const { address } = useAccount();
  const [description, setDescription] = useState("");

  if (!address) {
    return <div/>
  }

  return (
    <div className="flex flex-col items-center text-center">
      <RecipientProfile
        avatarPath="/assets/images/default_avatar.gif"
        nickname="Nix"
        address={address}
      />
      <div className="flex w-full flex-col gap-4 pt-5 sm:max-w-4xl">
        <TextField
          className="flex flex-col py-2 px-3 border-2 rounded-md border-gray-400"
          placeholder="Type your description here..."
          value={description}
          onChange={setDescription}
          minRows={6}
          maxLength={DESCRIPTION_MAX_LENGTH}
        />
        <div className="flex flex-row-reverse">
          <Button
            text="Save"
          />
        </div>
      </div>
    </div>
  );
};

export default SendDonationPageEdit;
