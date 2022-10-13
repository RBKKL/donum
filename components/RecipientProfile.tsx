import { FC } from "react";
import { BorderedImage } from "@components";

interface RecipientProfileProps {
  avatarPath: string;
  nickname: string;
  address: string;
}

export const RecipientProfile: FC<RecipientProfileProps> = ({
  avatarPath,
  nickname,
  address,
}) => (
  <div className="flex flex-col items-center w-full">
    <BorderedImage src={avatarPath} height={160} width={160} />
    <p className="text-2xl font-semibold py-2">{nickname}</p>
    <p className="text-sm text-ellipsis overflow-hidden w-full">{address}</p>
  </div>
);
