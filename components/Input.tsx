import { FC, ReactNode } from "react";
interface InputProps {
  value?: string;
  onChange?: (value: string) => void;
  rightCorner?: ReactNode;
}

export const Input: FC<InputProps> = ({ onChange, rightCorner, ...props }) => {
  return (
    <div className="flex justify-between items-center px-4 py-2 rounded-2xl bg-zinc-700">
      <input
        className="flex h-full w-full bg-transparent outline-none text-xl"
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {rightCorner}
    </div>
  );
};
