import { trpc } from "@lib/trpc";
import { NextPage } from "next";

const ProfilesPage: NextPage = () => {
  const profiles = trpc.devOnlyProfile.all.useQuery();

  if (!profiles.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {profiles.data?.map(
        ({ address, nickname, description, avatarUrl }, index) => (
          <div key={index}>
            <p>Wallet: {address}</p>
            <p>Nickname: {nickname}</p>
            {avatarUrl && <img src={avatarUrl} alt={avatarUrl} />}
            {!!description && <p>{description}</p>}
          </div>
        )
      )}
    </div>
  );
};

export default ProfilesPage;
