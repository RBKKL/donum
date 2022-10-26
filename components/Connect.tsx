import { ConnectButton } from "@rainbow-me/rainbowkit";

export const Connect = () => {
  return (
    <div className="flex w-full h-full flex-col items-center">
      <p className="pb-2">
        Connect your wallet to see this page!
      </p>
      <ConnectButton/>
    </div>
  );
};