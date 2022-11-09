import { trpc } from "@lib/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { fileToBase64 } from "@lib/helpers";
import { avatarAcceptableFileExtensions } from "@lib/constants";

const ProfilePage: NextPage = () => {
  const mutation = trpc.profile.edit.useMutation();
  const router = useRouter();
  const nickname = router.query.nickname as string;
  const profile = trpc.profile.byNickname.useQuery({ nickname });
  const [newNickname, setNewNickname] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [newBio, setNewBio] = useState<string | undefined>(undefined);

  const editProfile = () => {
    if (profile.data?.wallet) {
      mutation.mutate(
        {
          wallet: profile.data.wallet,
          nickname: newNickname !== "" ? newNickname : undefined,
          bio: newBio,
          avatar: newAvatar !== "" ? newAvatar : undefined,
        },
        {
          onSuccess: (data) => {
            router.push(`/profile/${data.nickname}`);
          },
        }
      );
    }
  };

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

  if (!profile.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {profile.data && (
        <div>
          <p>Wallet: {profile.data.wallet}</p>
          <p>Nickname: {profile.data.nickname}</p>
          {profile.data.bio && <p>{profile.data.bio}</p>}
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
          <p>new bio (optional): </p>
          <input
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            className="bg-slate-600"
          />
          <button
            onClick={editProfile}
            disabled={mutation.isLoading}
            type="button"
            className="bg-yellow-400"
          >
            Edit profile
          </button>
          {mutation.error && (
            <p>Something went wrong! {mutation.error.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
