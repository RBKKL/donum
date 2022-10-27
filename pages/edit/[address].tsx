import { Button } from "@components/Button";
import { RecipientProfile } from "@components/RecipientProfile";
import { TextField } from "@components/TextField";
import { trpc } from "@lib/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const EditDonationPage: NextPage = () => {
  const router = useRouter();
  const [newDescription, setNewDescription] = useState("");
  const address = router.query.address as string;
  const profile = trpc.profile.byAddress.useQuery({ address: address });
  const mutation = trpc.profile.addDescription.useMutation();

  const saveDescription = () => {
    mutation.mutate({ address: address, description: newDescription });
  };

  useEffect(() => {
    if (!profile.data.description) {
      return;
    }

    setNewDescription(profile.data.description);
  }, [profile.data.description]);

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
      <div className="flex w-full flex-col gap-4 pt-12 sm:max-w-lg">
        <TextField
          value={newDescription}
          onChange={(value) => setNewDescription(value)}
          minRows={6}
        />
        <div className="flex flex-row-reverse">
          <Button text="Save" onClick={saveDescription} />
        </div>
      </div>
    </div>
  );
};

export default EditDonationPage;
