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
  style?: "normal" | "minimalistic";
}

export const TextField: FC<TextFieldProps> = ({
  onChange,
  footer,
  style = "normal",
  ...props
}) => (
  <div
    className={classNames(
      "flex",
      {
        "flex-col rounded-md border-2 border-gray-400 py-2 px-3":
          style === "minimalistic",
      },
      {
        "h-full w-full flex-col rounded-2xl bg-zinc-700 p-4":
          style === "normal",
      }
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
