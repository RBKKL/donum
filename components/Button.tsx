import { FC } from "react";

interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  text: string;
}

export const Button: FC<ButtonProps> = ({
  disabled,
  onClick,
  fullWidth,
  text,
}) => (
  <button
    className={
      "w-full rounded-full bg-yellow-500 px-8 py-2 text-xl font-semibold transition-opacity disabled:opacity-50" +
      (!fullWidth ? " sm:w-fit" : "")
    }
    disabled={disabled}
    onClick={onClick}
  >
    {text}
  </button>
);
