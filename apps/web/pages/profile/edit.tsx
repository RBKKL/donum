import type { NextPage } from "next";
import { Button } from "@components/Button";
import { RecipientProfile } from "@components/RecipientProfile";
import { TextField } from "@components/TextField";
import { DESCRIPTION_MAX_LENGTH } from "shared/constants";
import { useState } from "react";
import { useAccount } from "wagmi";

const EditProfilePage: NextPage = () => {
  const { address } = useAccount();
  const [description, setDescription] = useState("");

  if (!address) {
    return <p>Connect your wallet to see this page</p>;
  }

  return (
    <div className="flex flex-col items-center text-center">
      <RecipientProfile
        avatarPath="/assets/images/default_avatar.gif"
        nickname="Nix"
        address={address}
      />
      <div className="flex w-full flex-col gap-4 pt-5 sm:max-w-4xl">
        <div className="flex flex-col rounded-md border-2 border-gray-400 py-2 px-3">
          <TextField
            placeholder="Type your description here..."
            value={description}
            onChange={setDescription}
            minRows={6}
            maxLength={DESCRIPTION_MAX_LENGTH}
          />
        </div>
        <div className="flex flex-row-reverse">
          <Button text="Save" />
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
