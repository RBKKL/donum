import { FC } from "react";
import { IconProps, BaseIcon } from "./BaseIcon";

export const UploadIcon: FC<IconProps> = (props) => (
  <BaseIcon src="/assets/svg/upload.svg" alt="Upload icon" {...props} />
);
