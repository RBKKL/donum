import classNames from "classnames";
import { FC, ReactNode } from "react";
interface InputProps {
  value?: string;
  downCorner?: ReactNode;
  rightCorner?: ReactNode;
  error?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  variant?: "normal" | "underlined";
  textSize?: "small" | "normal" | "large";
  textWeight?: "normal" | "semibold";
  maxLength?: number;
  placeholder?: string;
}

export const Input: FC<InputProps> = ({
  downCorner,
  onChange,
  rightCorner,
  error,
  variant = "normal",
  textSize = "normal",
  textWeight = "normal",
  ...props
}) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-between px-4 pt-2 pb-1",
        { "rounded-2xl bg-zinc-700": variant === "normal" },
        {
          "outline outline-2 outline-red-500": variant === "normal" && error,
        },
        { "border-b-2": variant === "underlined" },
        { "border-gray-400": variant === "underlined" && !error },
        {
          "border-red-500": variant === "underlined" && error,
        }
      )}
    >
      <div className={classNames("flex w-full flex-col")}>
        <input
          className={classNames(
            "mr-2 flex bg-transparent outline-none",
            { "text-base": textSize === "small" },
            { "text-xl": textSize === "normal" },
            { "text-2xl": textSize === "large" },
            { "text-center": variant === "underlined" },
            { "font-semibold": textWeight === "semibold" }
          )}
          onChange={(e) => onChange?.(e.target.value)}
          {...props}
        />
        {downCorner}
      </div>
      {rightCorner}
    </div>
  );
};
