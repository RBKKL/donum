import { BaseIcon } from "./BaseIcon";

export const EthIcon = () => (
  <div className="flex flex-auto flex-row items-center">
    <BaseIcon src="/eth.svg" alt="Ethereum icon" size="normal" />
    <p className="pl-2 text-lg font-medium">ETH</p>
  </div>
);
