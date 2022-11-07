import { FC } from "react";

interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  text: string;
  icon?: JSX.Element;
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
    className={
      "w-full rounded-full bg-yellow-500 py-2 font-semibold transition-opacity disabled:opacity-50" +
      (!fullWidth ? " sm:w-fit" : "") +
      (size === "small" ? " px-4" : " px-8") +
      (size === "small" ? " text-base" : " text-xl")
    }
    disabled={disabled}
    onClick={onClick}
  >
    <span className={icon ? "pr-2" : ""}>{icon}</span>
    {text}
  </button>
);
