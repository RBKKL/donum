import { trpc } from "@lib/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { fileToBase64 } from "@lib/helpers";
import { avatarAcceptableFileExtensions } from "shared/constants";

const AddProfilePage: NextPage = () => {
  const mutation = trpc.profile.add.useMutation();
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const router = useRouter();

  const uploadNewAvatarToClient = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      const avatarBase64 = await fileToBase64(e.target.files[0]);
      if (avatarBase64) {
        setAvatar(avatarBase64);
      }
    }
  };

  const createProfile = () => {
    mutation.mutate({
      address,
      nickname,
      description: description ?? undefined,
      avatar: avatar !== "" ? avatar : undefined,
    });
  };

  if (mutation.isSuccess) {
    router.push("/dashboard/profile");
  }

  return (
    <div className="flex w-96 flex-col gap-4">
      Wallet (Required. Filed for debug):
      <textarea
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="bg-slate-600"
        maxLength={42}
        minLength={42}
      />
      Nickname:
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="bg-slate-600"
      />
      Description (optional):
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="bg-slate-600"
      />
      Avatar (optional):
      <input
        type="file"
        onChange={(e) => uploadNewAvatarToClient(e)}
        accept={avatarAcceptableFileExtensions}
      />
      <button
        onClick={createProfile}
        disabled={mutation.isLoading}
        type="button"
        className="bg-yellow-400"
      >
        Create profile
      </button>
      {mutation.error && <p>Something went wrong! {mutation.error.message}</p>}
    </div>
  );
};

export default AddProfilePage;
