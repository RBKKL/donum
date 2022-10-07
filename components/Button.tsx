import {FC, ReactNode} from "react";

interface ButtonProps {
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  disabled,
  onClick,
  children,
}) => (
    <button
      className="rounded-full back bg-yellow-500 w-fit px-8 py-2"
      disabled={disabled}
      onClick={onClick}
    >
      <p className="font-semibold text-3xl">
        {children}
      </p>
    </button>
  )
