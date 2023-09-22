import { FC } from "react";
import { BaseIcon, IconProps } from "./BaseIcon";

export const EditIcon: FC<IconProps> = (props) => (
  <BaseIcon src="/edit.svg" alt="edit icon" {...props} />
);
