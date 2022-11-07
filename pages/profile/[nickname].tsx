import { trpc } from "@lib/trpc";
import { NextPage } from "next";
import { useRouter } from "next/router";

const ProfilePage: NextPage = () => {
  const router = useRouter();
  const nickname = router.query.nickname as string;
  const profile = trpc.profile.byNickname.useQuery({ nickname });

  if (!profile.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {profile.data && (
        <div>
          <p>Id: {profile.data.id}</p>
          <p>Nickname: {profile.data.nickname}</p>
          {profile.data.description && <p>{profile.data.description}</p>}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
