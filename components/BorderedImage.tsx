import { FC } from "react";
import Image from "next/image";

interface BorderedImageProps {
  src: string;
  height: number;
  width: number;
  alt: string;
}

export const BorderedImage: FC<BorderedImageProps> = ({
  src,
  height,
  width,
  alt,
}) => (
  <div className="flex rounded-2xl border-3">
    <Image
      className="rounded-2xl"
      src={src}
      height={height}
      width={width}
      alt={alt}
    />
  </div>
);
