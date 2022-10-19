import { BaseIcon } from "./BaseIcon";

export const EthIcon = () => (
  <div className="flex flex-auto flex-row items-center">
    <BaseIcon src="/assets/svg/eth.svg" alt="Ethereum icon" size="large" />
    <p className="pl-2 text-lg font-medium">ETH</p>
  </div>
);
