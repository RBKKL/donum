import { FC } from "react";

interface BalanceProps {
  balance: string;
}

export const Balance: FC<BalanceProps> = ({ balance }) => (
  <div className="whitespace-nowrap text-xs text-gray-400">
    Balance: {balance}
  </div>
);
