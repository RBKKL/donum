import { FC, MouseEventHandler } from "react";
import { BorderedImage } from "@components";
import { EditIcon } from "@components/icons/EditIcon";
import { formatAddress } from "@lib/helpers";

interface RecipientProfileProps {
  avatarPath: string;
  nickname: string;
  address: string;
  editable: boolean;
  onEditClick?: MouseEventHandler<HTMLImageElement>;
  shortenedAddress: boolean;
}

export const RecipientProfile: FC<RecipientProfileProps> = ({
  avatarPath,
  nickname,
  address,
  editable,
  onEditClick = () => {},
  shortenedAddress
}) => (
  <div className="flex flex-col items-center w-full">
    <BorderedImage src={avatarPath} height={160} width={160} />
    {editable ? (
        <div className="flex flex-row flex-nowrap items-center gap-x-2">
          <p className="text-2xl font-inter font-semibold py-2">{nickname}</p>
          <EditIcon onClick={onEditClick} />
        </div>
      ) : <p className="text-2xl font-semibold py-2">{nickname}</p>
    }
    <p className="text-sm text-ellipsis overflow-hidden align-center">
      {shortenedAddress ? formatAddress(address, 4, 4) : address}
    </p>
  </div>
);