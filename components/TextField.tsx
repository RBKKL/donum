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
  <div className="flex flex-col h-full w-full p-4 rounded-2xl bg-zinc-700">
    <TextareaAutosize
      placeholder="Type your message here..."
      className="h-full bg-transparent outline-none resize-none"
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    />
    {footer}
  </div>
);
