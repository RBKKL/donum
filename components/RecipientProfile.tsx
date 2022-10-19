import { FC, MouseEventHandler } from "react";
import { BorderedImage } from "@components/BorderedImage";
import { EditIcon } from "@components/icons/EditIcon";
import { formatAddress } from "@lib/helpers";

interface RecipientProfileProps {
  avatarPath: string;
  nickname: string;
  address: string;
  onEditClick?: MouseEventHandler<HTMLImageElement>;
  shortAddress?: boolean;
}

export const RecipientProfile: FC<RecipientProfileProps> = ({
  avatarPath,
  nickname,
  address,
  onEditClick,
  shortAddress,
}) => (
  <div className="flex flex-col items-center w-full">
    <BorderedImage
      src={avatarPath}
      height={160}
      width={160}
      alt="Recipient avatar"
    />
    <div className="flex flex-row flex-nowrap items-center gap-x-2">
      <p className="text-2xl font-semibold py-2">{nickname}</p>
      {onEditClick && <EditIcon size="small" onClick={onEditClick} />}
    </div>
    <p className="text-sm text-ellipsis overflow-hidden align-center">
      {shortAddress ? formatAddress(address) : address}
    </p>
  </div>
);
