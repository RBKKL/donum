import { Button } from "@components/Button";
import { RecipientProfile } from "@components/RecipientProfile";
import { TextField } from "@components/TextField";
import { trpc } from "@lib/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { DESCRIPTION_MAX_LENGTH } from "@lib/constants";
import { useState, useEffect } from "react";

const EditDonationPage: NextPage = () => {
  const router = useRouter();
  const [newDescription, setNewDescription] = useState("");
  const address = router.query.address as string;
  const profile = trpc.profile.byAddress.useQuery({ wallet: address });
  const mutation = trpc.profile.edit.useMutation();

  const saveDescription = () => {
    mutation.mutate({ wallet: address, description: newDescription });
  };

  useEffect(() => {
    if (!profile?.data?.description && profile.data?.description !== "") {
      return;
    }

    setNewDescription(profile.data.description);
  }, [profile.data?.description]);

  if (profile.isLoading) {
    return <div>Loading...</div>;
  }

  if (profile.isError || !profile.data) {
    return <div>Error</div>;
  }

  if (mutation.isSuccess) {
    router.push(`/dashboard/${address}`);
  }

  return (
    <div className="flex flex-col items-center text-center">
      <RecipientProfile
        avatarPath="/assets/images/default_avatar.gif"
        nickname={profile.data.nickname}
        address={address}
      />
      <div className="flex w-full flex-col gap-4 pt-5 sm:max-w-4xl">
        <div className="flex flex-col rounded-md border-2 border-gray-400 py-2 px-3">
          <TextField
            placeholder="Type your description here..."
            value={newDescription}
            onChange={(value) => setNewDescription(value)}
            minRows={6}
            maxLength={DESCRIPTION_MAX_LENGTH}
          />
        </div>
        <div className="flex flex-row-reverse">
          <Button text="Save" onClick={saveDescription} />
        </div>
      </div>
    </div>
  );
};

export default EditDonationPage;
