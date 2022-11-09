import { ConnectButton } from "@rainbow-me/rainbowkit";

export const ConnectWalletWarning = () => {
  return (
    <div className="flex h-full w-full flex-col items-center">
      <p className="pb-2">Connect your wallet to see this page!</p>
      <ConnectButton />
    </div>
  );
};
