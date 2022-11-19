import { Button } from "@components/Button";
import { TextField } from "@components/TextField";
import { trpc } from "@lib/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  avatarAcceptableFileExtensions,
  DESCRIPTION_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
} from "shared/constants";
import React, { useState, useEffect } from "react";
import { fileToBase64, isNumber } from "@lib/helpers";
import { ethers } from "ethers";
import { Loader } from "@components/Loader";
import { BorderedImage } from "@components/BorderedImage";
import { Input } from "@components/Input";
import { EthIcon } from "@components/icons/EthIcon";
import { UploadIcon } from "@components/icons/UploadIcon";

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
    <div className="flex w-full flex-col items-center text-center">
      <div className="relative h-40 w-40">
        <label
          htmlFor="avatar-upload"
          className="absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center bg-zinc-900/50"
        >
          <UploadIcon size="small" />
          <p className="pt-3">Upload avatar</p>
          <input
            className="hidden"
            id="avatar-upload"
            type="file"
            onChange={(e) => uploadNewAvatarToClient(e)}
            accept={avatarAcceptableFileExtensions}
          />
        </label>
        <BorderedImage
          layout="fill"
          src={profile.data.avatarUrl ?? "/assets/images/default_avatar.gif"}
          height={160}
          width={160}
          alt="Current avatar"
        />
      </div>
      <Input
        value={newNickname}
        onChange={(value) => setNewNickname(value)}
        style="minimalistic"
        maxLength={NICKNAME_MAX_LENGTH}
        error={newNickname.length < NICKNAME_MIN_LENGTH}
      />
      <div className="flex w-full flex-col gap-4 pt-5 sm:max-w-4xl">
        <TextField
          placeholder="Type your description here..."
          value={newDescription}
          onChange={(value) => setNewDescription(value)}
          minRows={6}
          maxLength={DESCRIPTION_MAX_LENGTH}
          style="minimalistic"
        />
        <h2 className="pt-8 text-2xl font-semibold">
          Donation notification settings
        </h2>
        <h3>Minimal donation amount to show notification</h3>
        <Input
          value={newMinShowAmount}
          onChange={(value) => setNewMinShowAmount(value)}
          textSize="small"
          rightCorner={
            <div className="flex flex-col items-end">
              <EthIcon />
            </div>
          }
        />
        <h3>Notification image</h3>
        <input type="file" />
        <h3>Notification sound</h3>
        <input type="file" />
        <div className="flex flex-row-reverse">
          <Button text="Save" onClick={editProfile} />
        </div>
      </div>
    </div>
  );
};

export default EditDonationPage;
