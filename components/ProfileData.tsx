import {FC} from "react";

interface ProfileDataProps {
  avatarPath?: string;
  nickname?: string;
  address?: string;
}

export const ProfileData: FC<ProfileDataProps> = ({
  avatarPath,
  nickname,
  address,
}) => (
    <div className="flex flex-col items-center w-full">
      <img className="w-56 h-56 border-2 rounded-2xl" src={avatarPath}/>
      <p className="font-inter text-2xl font-semibold py-2">{nickname}</p>
      <p className="font-inter text-base text-ellipsis overflow-hidden w-full">{address}</p>
    </div>
  )
