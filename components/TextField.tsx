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
}

export const TextField: FC<TextFieldProps> = ({
  onChange,
  footer,
  className,
  ...props
}) => (
  <div className={className}>
    <TextareaAutosize
      className="h-full resize-none bg-transparent outline-none overflow-hidden"
      onChange={(e) => onChange?.(e.target.value)}
      {...props}
    />
    {footer}
  </div>
);
