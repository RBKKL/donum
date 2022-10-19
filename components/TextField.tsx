import { FC, ReactNode } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface TextFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  minRows?: number;
  maxLength?: number;
  footer?: ReactNode;
}

export const TextField: FC<TextFieldProps> = ({
  onChange,
  footer,
  ...props
}) => (
  <div className="flex h-full w-full flex-col rounded-2xl bg-zinc-700 p-4">
    <TextareaAutosize
      placeholder="Type your message here..."
      className="h-full resize-none bg-transparent outline-none"
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    />
    {footer}
  </div>
);
