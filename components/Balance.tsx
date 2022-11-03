import { FC } from "react";
interface BalanceProps {
  disabled?: boolean;
  balance?: string;
}

export const Balance: FC<BalanceProps> = ({ disabled, balance }) => {
  return !disabled ? (
    <div className="whitespace-nowrap text-xs text-gray-400">
      Balance: {balance}
    </div>
  ) : (
    <></>
  );
};
