import {FC} from "react";
import Image from "next/image";

interface BorderedImageProps {
  src: string;
  height: number;
  width: number;
}

export const BorderedImage: FC<BorderedImageProps> = ({
  src,
  height,
  width,
}) => (
  <div className="flex border-2 rounded-2xl">
    <Image
      className="rounded-2xl"
      src={src}
      height={height}
      width={width}
    />
  </div>
)
