import { trpc } from "@lib/trpc";
import { NextPage } from "next";

const ProfilesPage: NextPage = () => {
  const profiles = trpc.profile.all.useQuery();

  if (!profiles.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {profiles.data?.map(({wallet, nickname, bio, avatarUrl }, index) => (
        <div key={index}>
          <p>Wallet: {wallet}</p>
          <p>Nickname: {nickname}</p>
          {avatarUrl && <img src={avatarUrl} alt={avatarUrl}/> }
          {bio && <p>{bio}</p>}
        </div>
      ))}
    </div>
  );
};

export default ProfilesPage;
