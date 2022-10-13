import { FC, ReactNode } from "react";

interface TextFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  maxLength?: number;
  footer?: ReactNode;
}

// TODO: add min height and autosizing
export const TextField: FC<TextFieldProps> = ({
  onChange,
  footer,
  ...props
}) => (
  <div className="flex flex-col h-full w-full p-4 rounded-2xl bg-zinc-700">
    <textarea
      placeholder="Type your message here..."
      className="h-full bg-transparent outline-none resize-none"
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    />
    {footer}
  </div>
);
