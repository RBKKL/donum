import classNames from "classnames";
import { FC } from "react";

interface BorderedImageProps {
  src: string;
  height: number;
  width: number;
  alt: string;
  layout?: "normal" | "fill";
}

export const BorderedImage: FC<BorderedImageProps> = ({
  src,
  height,
  width,
  alt,
  layout = "normal",
}) => (
  <div
    className={classNames("border-3 flex rounded-2xl", {
      absolute: layout === "fill",
    })}
  >
    <img
      className="rounded-2xl"
      src={src}
      height={height}
      width={width}
      alt={alt}
    />
  </div>
);
