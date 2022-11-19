import classNames from "classnames";
import { FC } from "react";
import Image from "next/image";

interface BorderedImageProps {
  src: string;
  height: number;
  width: number;
  alt: string;
  absolute?: boolean;
}

export const BorderedImage: FC<BorderedImageProps> = ({
  src,
  height,
  width,
  alt,
  absolute,
}) => (
  <div className={classNames("border-3 flex rounded-2xl", { absolute })}>
    <Image
      className="rounded-2xl"
      src={src}
      height={height}
      width={width}
      alt={alt}
    />
  </div>
);
