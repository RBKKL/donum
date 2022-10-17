import Image from "next/image";
import { FC, MouseEventHandler } from "react";

interface EditIconProps {
  onClick?: MouseEventHandler<HTMLImageElement>
}

export const EditIcon: FC<EditIconProps> = ({onClick}) => (
  <Image
    src="/assets/svg/edit_profile.svg"
    layout="fixed"
    width={16}
    height={16}
    onClick={onClick}/>
);
