import { FC } from "react";
import { BorderedImage } from "~/components/BorderedImage";
import { formatAddress } from "@donum/shared/helpers";
import classNames from "classnames";

interface RecipientProfileProps {
  avatarUrl: string;
  nickname?: string | null;
  address?: string;
  shortAddress?: boolean;
  showAddress?: boolean;
}

export const RecipientProfile: FC<RecipientProfileProps> = ({
  avatarUrl,
  nickname,
  address,
  shortAddress,
  showAddress = true,
}) => (
  <div className="flex w-full flex-col items-center pb-4">
    <BorderedImage
      src={avatarUrl}
      height={160}
      width={160}
      alt="Recipient avatar"
    />
    {nickname && (
      <div className="flex flex-row flex-nowrap items-center gap-x-2 pt-2 text-2xl font-semibold">
        {nickname}
      </div>
    )}
    {showAddress && address && (
      <p
        className={classNames(
          "align-center overflow-hidden text-ellipsis text-sm text-gray-400",
          { "pt-2": !nickname }
        )}
      >
        Address: {shortAddress ? formatAddress(address) : address}
      </p>
    )}
  </div>
);
