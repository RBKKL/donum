import { FC } from "react";
import { IconProps, BaseIcon } from "./BaseIcon";

export const EditIcon: FC<IconProps> = (props) => (
  <BaseIcon src="/assets/svg/edit_profile.svg" alt="edit icon" {...props} />
);
