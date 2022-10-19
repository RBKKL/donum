import { FC } from "react";
import Image from "next/image";

interface ResponsiveImageProps {
  src: string;
  alt: string;
}

export const ResponsiveImage: FC<ResponsiveImageProps> = ({ src, alt }) => (
  <div className="relative w-full h-full">
    <Image
      className="object-contain object-center"
      src={src}
      layout="fill"
      alt={alt}
    />
  </div>
);
