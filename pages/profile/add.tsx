import { trpc } from "@lib/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const AddProfilePage: NextPage = () => {
  const mutation = trpc.profile.add.useMutation();
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const router = useRouter();

  const createProfile = () => {
    mutation.mutate({ nickname, address: "address", description: bio ?? undefined });
  };

  if (mutation.isSuccess) {
    router.push("/profile");
  }

  return (
    <div className="flex w-96 flex-col gap-4">
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
