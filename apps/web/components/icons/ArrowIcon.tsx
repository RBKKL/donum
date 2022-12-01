import { FC } from "react";
import { BaseIcon, IconProps } from "./BaseIcon";

export const ArrowIcon: FC<IconProps> = (props) => (
  <BaseIcon src="/small_arrow.svg" alt="arrow icon" {...props} />
);
