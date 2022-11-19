import classNames from "classnames";
import { FC, ReactNode } from "react";
interface InputProps {
  value?: string;
  rightCorner?: ReactNode;
  error?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  variant?: "normal" | "underlined";
  textSize?: "small" | "normal" | "large";
  maxLength?: number;
}

export const Input: FC<InputProps> = ({
  onChange,
  rightCorner,
  error,
  variant = "normal",
  textSize = "normal",
  ...props
}) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-between px-4 py-2",
        { "rounded-2xl bg-zinc-700": variant === "normal" },
        { "outline outline-2 outline-red-500": variant === "normal" && error },
        { "border-b-2": variant === "underlined" },
        { "border-gray-400": variant === "underlined" && !error },
        {
          "border-red-500": variant === "underlined" && error,
        }
      )}
    >
      <input
        className={classNames(
          "flex bg-transparent outline-none",
          { "text-lg": textSize === "small" },
          { "text-2xl font-semibold": textSize === "normal" },
          { "text-3xl": textSize === "large" },
          { "text-center": variant === "underlined" }
        )}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {rightCorner}
    </div>
  );
};
