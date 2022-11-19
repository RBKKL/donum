import { FC } from "react";
import { BorderedImage } from "@components/BorderedImage";
import { formatAddress } from "@donum/shared/helpers";

interface RecipientProfileProps {
  avatarPath: string;
  nickname: string;
  address?: string;
  shortAddress?: boolean;
}

export const RecipientProfile: FC<RecipientProfileProps> = ({
  avatarPath,
  nickname,
  address,
  shortAddress,
}) => (
  <div className="flex w-full flex-col items-center">
    <BorderedImage
      src={avatarPath}
      height={160}
      width={160}
      alt="Recipient avatar"
    />
    <div className="flex flex-row flex-nowrap items-center gap-x-2">
      <p className="py-2 text-2xl font-semibold">{nickname}</p>
    </div>
    {address && (
      <p className="align-center overflow-hidden text-ellipsis text-sm text-gray-400">
        Address: {shortAddress ? formatAddress(address) : address}
      </p>
    )}
  </div>
);
