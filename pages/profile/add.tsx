import { trpc } from "@lib/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {fileToBase64} from "@lib/helpers";

const AddProfilePage: NextPage = () => {
  const mutation = trpc.profile.add.useMutation();
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [wallet, setWallet] = useState("");
  const [avatar, setAvatar] = useState("");
  const router = useRouter();

  const uploadNewAvatarToClient = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    if (e.target.files?.[0]) {
      const avatarBase64 = await fileToBase64(e.target.files[0]);
      if (avatarBase64) {
        console.log(avatarBase64);
        setAvatar(avatarBase64);
      }
    }
  }

  const createProfile = () => {
    mutation.mutate({ wallet, nickname, bio: bio ?? undefined, avatar: avatar ?? undefined });
  };

  if (mutation.isSuccess) {
    router.push("/profile");
  }

  return (
    <div className="flex w-96 flex-col gap-4">
      Wallet (Required):
      <textarea
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
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
      Bio (optional):
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="bg-slate-600"
      />
      Avatar (optional):
      <input type="file"
             onChange={e => uploadNewAvatarToClient(e)}
             accept="image/gif, image/jpg, image/png"
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
