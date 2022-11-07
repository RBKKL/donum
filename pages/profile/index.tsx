import { trpc } from "@lib/trpc";
import { NextPage } from "next";

const ProfilesPage: NextPage = () => {
  const profiles = trpc.profile.all.useQuery();

  if (!profiles.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {profiles.data?.map(({ id, nickname, description }) => (
        <div key={id}>
          <p>Id: {id}</p>
          <p>Nickname: {nickname}</p>
          {description && <p>{description}</p>}
        </div>
      ))}
    </div>
  );
};

export default ProfilesPage;
