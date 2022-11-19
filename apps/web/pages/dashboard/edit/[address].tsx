import { Button } from "@components/Button";
import { RecipientProfile } from "@components/RecipientProfile";
import { TextField } from "@components/TextField";
import { trpc } from "@lib/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  avatarAcceptableFileExtensions,
  DESCRIPTION_MAX_LENGTH,
} from "shared/constants";
import React, { useState, useEffect } from "react";
import { isNumber, fileToBase64 } from "shared/helpers";
import { ethers } from "ethers";
import { Loader } from "@components/Loader";

const EditDonationPage: NextPage = () => {
  const router = useRouter();
  const [newNickname, setNewNickname] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newMinShowAmount, setNewMinShowAmount] = useState("");
  const address = router.query.address as string;
  const profile = trpc.profile.byAddress.useQuery({ address });
  const mutation = trpc.profile.edit.useMutation();

  const uploadNewAvatarToClient = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      const newAvatarBase64 = await fileToBase64(e.target.files[0]);
      if (newAvatarBase64) {
        setNewAvatar(newAvatarBase64);
      }
    }
  };

  const editProfile = () => {
    if (!newMinShowAmount || isNumber(newMinShowAmount)) {
      mutation.mutate({
        address,
        nickname: newNickname !== "" ? newNickname : undefined,
        avatar: newAvatar !== "" ? newAvatar : undefined,
        description: newDescription,
        minShowAmount:
          newMinShowAmount !== ""
            ? ethers.utils.parseUnits(newMinShowAmount, "ether").toString()
            : undefined,
      });
    }
  };

  useEffect(() => {
    if (!profile?.data?.description && profile.data?.description !== "") {
      return;
    }

    setNewDescription(profile.data.description);
  }, [profile.data?.description]);

  if (profile.isLoading) return <Loader />;

  if (profile.isError || !profile.data) {
    return <div>Error</div>;
  }

  if (mutation.isSuccess) {
    router.push(`/dashboard/${address}`);
  }

  return (
    <div className="flex flex-col items-center text-center">
      <RecipientProfile
        avatarPath={
          profile.data.avatarUrl ?? "/assets/images/default_avatar.gif"
        }
        nickname={profile.data.nickname ?? ""}
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
        <p>new nickname (optional): </p>
        <input
          value={newNickname}
          onChange={(e) => setNewNickname(e.target.value)}
          className="bg-slate-600"
        />
        <p>new avatar (optional): </p>
        <input
          type="file"
          onChange={(e) => uploadNewAvatarToClient(e)}
          accept={avatarAcceptableFileExtensions}
        />
        <p>new minimal donation amount for showing alert (optional, ETH): </p>
        <input
          type="number"
          min="0"
          value={newMinShowAmount}
          onChange={(e) => setNewMinShowAmount(e.target.value)}
          className="bg-slate-600"
        />
        <div className="flex flex-row-reverse">
          <Button text="Save" onClick={editProfile} />
        </div>
      </div>
    </div>
  );
};

export default EditDonationPage;
