import { BaseIcon } from "./BaseIcon";

export const EthIcon = () => (
  <div className="flex flex-auto flex-row items-center">
    <BaseIcon src="/assets/svg/eth.svg" alt="Ethereum icon" size="large" />
    <p className="font-medium text-lg pl-2">ETH</p>
  </div>
);
