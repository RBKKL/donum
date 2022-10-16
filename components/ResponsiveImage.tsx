import { FC } from "react";
import Image from "next/image";

interface ResponsiveImageProps {
  src: string;
  percentWidth: number;
  percentHeight: number;
}

export const ResponsiveImage: FC<ResponsiveImageProps> = ({
  src,
  percentWidth,
  percentHeight,
}) => {
  if (
    percentWidth < 0 ||
    percentWidth > 100 ||
    percentHeight < 0 ||
    percentHeight > 100
  ) {
    return <div></div>;
  }

  return (
    <div
      className="relative"
      style={{ width: `${percentWidth}%`, height: `${percentHeight}%` }}
    >
      <Image className="object-contain object-center" src={src} layout="fill" />
    </div>
  );
};
