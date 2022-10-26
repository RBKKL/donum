import type { NextPage } from "next";
import { Button } from "@components/Button";
import { RecipientProfile } from "@components/RecipientProfile";
import { TextField } from "@components/TextField";
import { DESCRIPTION_MAX_LENGTH } from "@lib/constants";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { trpc } from "@lib/trpc";
import { useRouter } from "next/router";

const SendDonationPageEdit: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [description, setDescription] = useState("");

  const { data } = trpc.donationPage.byAddress.useQuery({ address });
  const mutation = trpc.donationPage.edit.useMutation();

  useEffect(() => {
    if (data?.description) {
      setDescription(data.description);
    }
  }, [data]);

  if (!address) {
    return <div />;
  }

  const saveChanges = () => {
    mutation.mutate({ address, description });
  };

  if (mutation.isSuccess) {
    router.push(`/c/${address}`);
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
          className="flex flex-col rounded-md border-2 border-gray-400 py-2 px-3"
          placeholder="Type your description here..."
          value={description}
          onChange={setDescription}
          minRows={6}
          maxLength={DESCRIPTION_MAX_LENGTH}
        />
        <div className="flex flex-row-reverse">
          <Button text="Save" onClick={saveChanges} />
        </div>
      </div>
    </div>
  );
};

export default SendDonationPageEdit;
