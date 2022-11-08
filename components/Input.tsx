import { FC, ReactNode } from "react";
interface InputProps {
  value?: string;
  rightCorner?: ReactNode;
  error?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

export const Input: FC<InputProps> = ({
  onChange,
  rightCorner,
  error,
  ...props
}) => {
  return (
    <div
      className={
        "flex items-center justify-between rounded-2xl bg-zinc-700 px-4 py-2" +
        (error ? " outline outline-2 outline-red-500" : "")
      }
    >
      <input
        className="flex h-full w-full bg-transparent text-xl outline-none"
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {rightCorner}
    </div>
  );
};
