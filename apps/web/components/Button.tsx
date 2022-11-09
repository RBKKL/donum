import classNames from "classnames";
import { FC, ReactNode } from "react";

interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  text: string;
  icon?: ReactNode;
  size?: "small" | "normal";
}

export const Button: FC<ButtonProps> = ({
  disabled,
  onClick,
  fullWidth,
  text,
  icon,
  size = "normal",
}) => (
  <button
    className={classNames(
      "w-full rounded-full bg-yellow-500 py-2 font-semibold transition-opacity disabled:opacity-50",
      { "sm:w-fit": !fullWidth },
      { "px-4 text-base": size === "small" },
      { "px-8 text-xl": size === "normal" }
    )}
    disabled={disabled}
    onClick={onClick}
  >
    <span className={icon ? "pr-2" : ""}>{icon}</span>
    {text}
  </button>
);
