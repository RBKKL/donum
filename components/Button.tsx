import { FC } from "react";

interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  fullWidth?: boolean;
  text: string;
}

export const Button: FC<ButtonProps> = ({ disabled, onClick, fullWidth, text }) => (
  <button
    className={"rounded-full bg-yellow-500 px-8 py-2 w-full font-semibold text-xl disabled:opacity-50 transition-opacity" + (!fullWidth ? " sm:w-fit" : "")}
    disabled={disabled}
    onClick={onClick}
  >
    {text}
  </button>
);
