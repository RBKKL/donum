import { FC } from "react";
import { BaseIcon, IconProps } from "./BaseIcon";

export const CrossIcon: FC<IconProps> = (props) => (
  <BaseIcon src="/assets/svg/cross.svg" alt="cross icon" {...props} />
);
