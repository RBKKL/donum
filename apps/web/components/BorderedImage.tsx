import { FC } from "react";
import Image from "next/image";
import classNames from "classnames";

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
  <div
    style={{ height: height, width: width }}
    className={classNames(
      "border-3 overflow-hidden rounded-2xl bg-zinc-50",
      {
        absolute,
      },
      { relative: !absolute }
    )}
  >
    <Image className="object-cover" fill src={src} alt={alt} />
  </div>
);
