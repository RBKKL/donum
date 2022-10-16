import Image from "next/image";
import { FC, MouseEventHandler } from "react";

interface EditIconProps {
  onClick : MouseEventHandler<HTMLImageElement>
}

export const EditIcon: FC<EditIconProps> = (props: EditIconProps) => (
  <Image
    src="/assets/svg/edit_profile.svg"
    layout="fixed"
    width={16}
    height={16}
    onClick={props.onClick}/>
);
