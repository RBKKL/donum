import { FC, MouseEventHandler } from "react";
import Image from "next/image";

type IconSize = "small" | "normal" | "large";

interface BaseIconProps {
  src: string;
  alt: string;
  size?: IconSize;
  onClick?: MouseEventHandler<HTMLImageElement>;
}

export type IconProps = Omit<BaseIconProps, "src" | "alt">;

const sizes: Record<IconSize, number> = {
  small: 16,
  normal: 24,
  large: 32,
};

export const BaseIcon: FC<BaseIconProps> = ({
  src,
  alt,
  size = "normal",
  onClick,
}) => (
  <Image
    src={src}
    alt={alt}
    width={sizes[size]}
    height={sizes[size]}
    onClick={onClick}
  />
);
