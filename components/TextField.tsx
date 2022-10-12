import { FC, ReactNode } from "react";

interface TextFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  rows?: number;
  maxLength?: number;
  footer?: ReactNode;
}

export const TextField: FC<TextFieldProps> = ({
  onChange,
  footer,
  ...props
}) => (
  <div className="flex flex-col w-full p-4 rounded-2xl bg-zinc-700">
    <textarea
      placeholder="Type your message here..."
      className="h-full text-lg bg-transparent outline-none resize-none"
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    />
    {footer}
  </div>
);
