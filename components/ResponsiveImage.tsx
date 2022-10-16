import { FC } from "react";
import Image from "next/image";

interface ResponsiveImageProps {
  src: string;
}

export const ResponsiveImage: FC<ResponsiveImageProps> = ({ src }) => (
  <div className="relative w-full h-full">
    <Image className="object-contain object-center" src={src} layout="fill" />
  </div>
);
