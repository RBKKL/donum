import { FC } from "react";
import classNames from "classnames";

interface LoaderProps {
  size?: number;
  color?: string;
  className?: string;
}

export const Loader: FC<LoaderProps> = ({
  size = 80,
  color = "white",
  className = "",
}) => (
  <div
    style={{ width: size, height: size }}
    className={classNames("relative inline-block", className)}
  >
    <div
      style={{ transformOrigin: `${0.5 * size}px ${0.5 * size}px` }}
      className="animate-loader-spin-1"
    >
      <div
        style={{
          width: 0.0875 * size,
          height: 0.0875 * size,
          backgroundColor: color,
          marginTop: -0.05 * size,
          marginLeft: -0.05 * size,
          top: 0.7875 * size,
          left: 0.7875 * size,
        }}
        className="absolute block rounded-full"
      ></div>
    </div>
    <div
      style={{ transformOrigin: `${0.5 * size}px ${0.5 * size}px` }}
      className="animate-loader-spin-2"
    >
      <div
        style={{
          width: 0.0875 * size,
          height: 0.0875 * size,
          backgroundColor: color,
          marginTop: -0.05 * size,
          marginLeft: -0.05 * size,
          top: 0.85 * size,
          left: 0.7 * size,
        }}
        className="absolute block rounded-full"
      ></div>
    </div>
    <div
      style={{ transformOrigin: `${0.5 * size}px ${0.5 * size}px` }}
      className="animate-loader-spin-3"
    >
      <div
        style={{
          width: 0.0875 * size,
          height: 0.0875 * size,
          backgroundColor: color,
          marginTop: -0.05 * size,
          marginLeft: -0.05 * size,
          top: 0.8875 * size,
          left: 0.6 * size,
        }}
        className="absolute block rounded-full"
      ></div>
    </div>
    <div
      style={{ transformOrigin: `${0.5 * size}px ${0.5 * size}px` }}
      className="animate-loader-spin-4"
    >
      <div
        style={{
          width: 0.0875 * size,
          height: 0.0875 * size,
          backgroundColor: color,
          marginTop: -0.05 * size,
          marginLeft: -0.05 * size,
          top: 0.9 * size,
          left: 0.5 * size,
        }}
        className="absolute block rounded-full"
      ></div>
    </div>
    <div
      style={{ transformOrigin: `${0.5 * size}px ${0.5 * size}px` }}
      className="animate-loader-spin-5"
    >
      <div
        style={{
          width: 0.0875 * size,
          height: 0.0875 * size,
          backgroundColor: color,
          marginTop: -0.05 * size,
          marginLeft: -0.05 * size,
          top: 0.8875 * size,
          left: 0.4 * size,
        }}
        className="absolute block rounded-full"
      ></div>
    </div>
    <div
      style={{ transformOrigin: `${0.5 * size}px ${0.5 * size}px` }}
      className="animate-loader-spin-6"
    >
      <div
        style={{
          width: 0.0875 * size,
          height: 0.0875 * size,
          backgroundColor: color,
          marginTop: -0.05 * size,
          marginLeft: -0.05 * size,
          top: 0.85 * size,
          left: 0.3 * size,
        }}
        className="absolute block rounded-full"
      ></div>
    </div>
    <div
      style={{ transformOrigin: `${0.5 * size}px ${0.5 * size}px` }}
      className="animate-loader-spin-7"
    >
      <div
        style={{
          width: 0.0875 * size,
          height: 0.0875 * size,
          backgroundColor: color,
          marginTop: -0.05 * size,
          marginLeft: -0.05 * size,
          top: 0.7875 * size,
          left: 0.2125 * size,
        }}
        className="absolute block rounded-full"
      ></div>
    </div>
    <div
      style={{ transformOrigin: `${0.5 * size}px ${0.5 * size}px` }}
      className="animate-loader-spin-8"
    >
      <div
        style={{
          width: 0.0875 * size,
          height: 0.0875 * size,
          backgroundColor: color,
          marginTop: -0.05 * size,
          marginLeft: -0.05 * size,
          top: 0.7 * size,
          left: 0.15 * size,
        }}
        className="absolute block rounded-full"
      ></div>
    </div>
  </div>
);
