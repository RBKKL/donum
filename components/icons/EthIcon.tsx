import Image from "next/image";

export const EthIcon = () => (
  <div className="flex flex-auto flex-row items-center">
    <Image src="/assets/svg/eth.svg" layout="fixed" width={32} height={32} />
    <p className="font-medium text-lg pl-2">ETH</p>
  </div>
);
