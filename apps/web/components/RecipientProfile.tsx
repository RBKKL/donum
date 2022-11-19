import { FC, MouseEventHandler } from "react";
import { BorderedImage } from "@components/BorderedImage";
import { EditIcon } from "@components/icons/EditIcon";
import { formatAddress } from "@lib/helpers";

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
    <p className="align-center overflow-hidden text-ellipsis text-sm">
      {address && (shortAddress ? formatAddress(address) : address)}
    </p>
  </div>
);
