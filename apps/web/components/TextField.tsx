import classNames from "classnames";
import { FC, ReactNode } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface TextFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  minRows?: number;
  placeholder?: string;
  maxLength?: number;
  footer?: ReactNode;
  className?: string;
  variant?: "normal" | "outlined";
  textSize?: "small" | "normal" | "large";
}

export const TextField: FC<TextFieldProps> = ({
  onChange,
  footer,
  variant = "normal",
  textSize = "normal",
  ...props
}) => (
  <div
    className={classNames(
      "flex",
      {
        "flex-col rounded-md border-2 border-gray-400 px-3 py-2":
          variant === "outlined",
      },
      {
        "h-full w-full flex-col rounded-2xl bg-zinc-700 p-4":
          variant === "normal",
      },
      { "text-sm": textSize === "small" }
    )}
  >
    <TextareaAutosize
      className="h-full resize-none overflow-hidden bg-transparent outline-none"
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    />
    {footer}
  </div>
);
