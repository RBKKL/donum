import { FC } from "react";
import { AVATAR_ACCEPTABLE_FILE_TYPES } from "@donum/shared/constants";
import { BorderedImage } from "./BorderedImage";
import { UploadIcon } from "./icons/UploadIcon";

interface AvatarUploaderProps {
  currentAvatarUrl: string;
  onUpload: (newAvatar: File) => void;
}

export const AvatarUploader: FC<AvatarUploaderProps> = ({
  onUpload,
  currentAvatarUrl,
}) => {
  return (
    <div className="relative h-40 w-40 cursor-pointer">
      <label
        htmlFor="avatar-upload"
        className="absolute inset-0 z-10 flex h-full w-full cursor-pointer flex-col items-center justify-center bg-zinc-900/50"
      >
        <UploadIcon size="small" />
        <p className="pt-3">Upload avatar</p>
        <input
          className="hidden"
          id="avatar-upload"
          type="file"
          onChange={(e) => e.target?.files?.[0] && onUpload(e.target.files[0])}
          accept={AVATAR_ACCEPTABLE_FILE_TYPES.join(",")}
        />
      </label>
      <BorderedImage
        src={currentAvatarUrl}
        height={160}
        width={160}
        alt="Current avatar"
        absolute
      />
    </div>
  );
};
