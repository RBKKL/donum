import { FC } from "react";
import { ResponsiveImage } from "@components/ResponsiveImage";
import { BigNumber, ethers } from "ethers";

interface DonationAlertProps {
  src: string;
  amount: BigNumber;
  sender: string;
  message: string;
}

export const DonationAlert: FC<DonationAlertProps> = ({
  src,
  amount,
  sender,
  message,
}) => (
  <div className="w-full h-full flex flex-col items-center bg-green-screen">
    <ResponsiveImage src={src} />
    <h1 className="text-center pt-2.5 text-yellow-500 text-3xl font-bold text-border-2">
      {sender} sent {ethers.utils.formatEther(amount)} ETH
    </h1>
    <p className="text-center pt-2.5 text-zinc-50 text-border-1 leading-none text-xl">
      {message}
    </p>
  </div>
);
