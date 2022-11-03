import { FC, ReactNode } from "react";
interface BalanceProps {
    disabled?: boolean;
    balance?: string;
}

export const Balance: FC<BalanceProps> = ({ disabled, balance }) => {
    if (!disabled)
        return (
            <div className="text-gray-400 text-xs whitespace-nowrap">
                Balance: {balance}
            </div>)
    else
        return (<div></div>)
};
