import classNames from "classnames";
import { FC, ReactNode } from "react";
interface InputProps {
  value?: string;
  rightCorner?: ReactNode;
  error?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  style?: "normal" | "minimalistic";
  textSize?: "small" | "normal" | "large";
  maxLength?: number;
}

export const Input: FC<InputProps> = ({
  onChange,
  rightCorner,
  error,
  style = "normal",
  textSize = "normal",
  ...props
}) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-between px-4 py-2",
        { "rounded-2xl bg-zinc-700": style === "normal" },
        { "outline outline-2 outline-red-500": style === "normal" && error },
        { "border-b-2": style === "minimalistic" },
        { "border-gray-400": style === "minimalistic" && !error },
        {
          "border-red-500": style === "minimalistic" && error,
        }
      )}
    >
      <input
        className={classNames(
          "flex bg-transparent outline-none",
          { "text-lg": textSize === "small" },
          { "text-2xl font-semibold": textSize === "normal" },
          { "text-3xl": textSize === "large" },
          { "text-center w-24": style === "minimalistic" }
        )}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {rightCorner}
    </div>
  );
};
