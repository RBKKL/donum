import classNames from "classnames";
import { FC, ReactNode } from "react";

interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  text: string;
  icon?: ReactNode;
  size?: "small" | "normal";
  color?: "primary" | "success" | "error";
  className?: string;
}

export const Button: FC<ButtonProps> = ({
  disabled,
  onClick,
  fullWidth,
  text,
  icon,
  size = "normal",
  color = "primary",
  className = "",
}) => (
  <button
    className={classNames(
      "flex w-full items-center justify-center rounded-full py-2 font-semibold transition-opacity disabled:opacity-50",
      // size
      {
        "sm:w-fit": !fullWidth,
        "px-4 text-base": size === "small",
        "px-8 text-xl": size === "normal",
      },
      // color
      {
        "bg-yellow-500": color === "primary",
        "bg-green": color === "success",
        "bg-red": color === "error",
      },
      className
    )}
    disabled={disabled}
    onClick={onClick}
  >
    <span className={icon ? "pr-2" : ""}>{icon}</span>
    {text}
  </button>
);
