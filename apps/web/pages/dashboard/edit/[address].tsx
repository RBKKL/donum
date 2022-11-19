import { Button } from "@components/Button";
import { TextField } from "@components/TextField";
import { trpc } from "@lib/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  DASHBOARD_PAGE_PATH,
  DESCRIPTION_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
} from "shared/constants";
import React, { useState, useEffect } from "react";
import { isNumber } from "shared/helpers";
import { fileToBase64 } from "shared/utils/base64";
import { ethers } from "ethers";
import { Loader } from "@components/Loader";
import { Input } from "@components/Input";
import { EthIcon } from "@components/icons/EthIcon";
import { AvatarUploader } from "@components/AvatarUploader";

const EditDonationPage: NextPage = () => {
  const router = useRouter();
  const [newNickname, setNewNickname] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newMinShowAmount, setNewMinShowAmount] = useState("");
  const address = router.query.address as string;
  const profile = trpc.profile.byAddress.useQuery({ address });
  const mutation = trpc.profile.edit.useMutation();

  const uploadNewAvatarToClient = async (file: File) => {
    const newAvatarBase64 = await fileToBase64(file);
    if (newAvatarBase64) {
      setNewAvatar(newAvatarBase64);
    }
  };

  const editProfile = () => {
    if (!newMinShowAmount || isNumber(newMinShowAmount)) {
      mutation.mutate({
        address,
        nickname: newNickname,
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
    if (profile.data) {
      setNewNickname(profile.data?.nickname ?? "");
      setNewDescription(profile.data?.description);
    }
  }, [profile.data]);

  if (profile.isLoading) return <Loader />;

  if (profile.isError || !profile.data) {
    return <div>Error</div>;
  }

  if (mutation.isSuccess) {
    router.push(DASHBOARD_PAGE_PATH);
  }

  const isNicknameValid =
    newNickname === "" ||
    (newNickname.length >= NICKNAME_MIN_LENGTH &&
      newNickname.length <= NICKNAME_MAX_LENGTH);

  return (
    <div className="flex w-full flex-col items-center text-center">
      <AvatarUploader
        currentAvatarUrl={profile.data.avatarUrl ?? "/default_avatar.gif"}
        onUpload={uploadNewAvatarToClient}
      />
      <Input
        value={newNickname}
        onChange={setNewNickname}
        variant="underlined"
        maxLength={NICKNAME_MAX_LENGTH}
        error={!isNicknameValid}
      />
      <div className="flex w-full flex-col gap-4 pt-5 sm:max-w-4xl">
        <TextField
          placeholder="Type your description here..."
          value={newDescription}
          onChange={setNewDescription}
          minRows={6}
          maxLength={DESCRIPTION_MAX_LENGTH}
          variant="outlined"
        />
        <h2 className="pt-8 text-2xl font-semibold">
          Donation notification settings
        </h2>
        <h3>Minimal donation amount to show notification</h3>
        <Input
          value={newMinShowAmount}
          onChange={setNewMinShowAmount}
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
