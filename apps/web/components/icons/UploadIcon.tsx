import { FC } from "react";
import { BaseIcon, IconProps } from "./BaseIcon";

export const UploadIcon: FC<IconProps> = (props) => (
  <BaseIcon src="/upload.svg" alt="Upload icon" {...props} />
);
