import { FC } from "react";
import { BaseIcon, IconProps } from "./BaseIcon";

export const CrossIcon: FC<IconProps> = (props) => (
  <BaseIcon src="/cross.svg" alt="cross icon" {...props} />
);
