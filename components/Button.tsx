import { FC } from "react";

interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  text: string;
}

export const Button: FC<ButtonProps> = ({ disabled, onClick, text }) => (
  <button
    className="rounded-full bg-yellow-500 px-8 py-2 w-full sm:w-fit font-semibold text-xl"
    disabled={disabled}
    onClick={onClick}
  >
    {text}
  </button>
);
