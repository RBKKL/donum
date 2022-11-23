import { Button } from "@components/Button";
import { TextField } from "@components/TextField";
import { trpc } from "@lib/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  DESCRIPTION_MAX_LENGTH,
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
} from "@donum/shared/constants";
import React, { useState, useEffect } from "react";
import { isNumber } from "@donum/shared/helpers";
import { fileToBase64 } from "@donum/shared/utils/base64";
import { ethers } from "ethers";
import { Loader } from "@components/Loader";
import { routes } from "@lib/routes";
import { Input } from "@components/Input";
import { EthIcon } from "@components/icons/EthIcon";
import { AvatarUploader } from "@components/AvatarUploader";
import { useUploadFiles } from "@hooks/useUploadFiles";

const EditDonationPage: NextPage = () => {
  const router = useRouter();
  const [newNickname, setNewNickname] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [avatarFile, setAvatarFile] = useState<File>();
  const [newDescription, setNewDescription] = useState("");
  const [newMinShowAmount, setNewMinShowAmount] = useState("");
  const address = router.query.address as string;
  const profile = trpc.profile.byAddress.useQuery({ address });
  const editProfile = trpc.profile.edit.useMutation();
  const uploadFiles = useUploadFiles();

  // TODO: remove base64 logic
  const uploadNewAvatarToClient = async (file: File) => {
    setAvatarFile(file);
    const newAvatarBase64 = await fileToBase64(file);
    if (newAvatarBase64) {
      setNewAvatar(newAvatarBase64);
    }
  };

  const onSave = async () => {
    let avatarUrl: string | undefined;
    if (avatarFile) {
      [avatarUrl] = await uploadFiles([
        {
          file: avatarFile,
          type: "avatar",
        },
      ]);
    }
    if (avatarUrl || !newMinShowAmount || isNumber(newMinShowAmount)) {
      editProfile.mutate({
        address,
        nickname: newNickname,
        avatarUrl,
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
      if (profile.data.nickname) setNewNickname(profile.data.nickname);
      if (profile.data.avatarUrl) setNewAvatar(profile.data.avatarUrl);
      if (profile.data.description) setNewDescription(profile.data.description);
    }
  }, [profile.data]);

  if (profile.isLoading) return <Loader />;

  if (profile.isError || !profile.data) {
    return <div>Error</div>;
  }

  if (editProfile.isSuccess) {
    router.push(routes.dashboard);
  }

  const isNicknameValid =
    newNickname === "" ||
    (newNickname.length >= NICKNAME_MIN_LENGTH &&
      newNickname.length <= NICKNAME_MAX_LENGTH);

  return (
    <div className="flex w-full flex-col items-center text-center">
      <AvatarUploader
        currentAvatarUrl={newAvatar || "/default_avatar.gif"}
        onUpload={uploadNewAvatarToClient}
      />
      <Input
        value={newNickname}
        onChange={setNewNickname}
        maxLength={NICKNAME_MAX_LENGTH}
        error={!isNicknameValid}
        placeholder="Nickname..."
        variant="underlined"
        textSize="large"
        textWeight="semibold"
      />
      <div className="flex w-full flex-col gap-4 pt-5 sm:max-w-4xl">
        <TextField
          placeholder="Type your description here..."
          value={newDescription}
          onChange={setNewDescription}
          minRows={6}
          maxLength={DESCRIPTION_MAX_LENGTH}
          variant="outlined"
          textSize="small"
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
          <Button text="Save" onClick={onSave} />
        </div>
      </div>
    </div>
  );
};

export default EditDonationPage;
