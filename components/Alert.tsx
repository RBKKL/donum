import { FC } from "react";
import { ResponsiveImage } from "@components/ResponsiveImage";

interface AlertProps {
  imgSrc: string;
  donateValue: number;
  senderAddress: string;
  message: string;
}

export const Alert: FC<AlertProps> = ({
  imgSrc,
  donateValue,
  senderAddress,
  message,
}) => (
  <div className="w-full h-full flex flex-col items-center bg-green-screen">
    <ResponsiveImage src={imgSrc} />
    <h1 className="text-center pt-2.5 text-yellow-500 text-3xl font-bold text-border-2">
      {senderAddress} sent {donateValue} ETH
    </h1>
    <p className="text-center pt-2.5 text-zinc-50 text-border-1 leading-none text-xl">
      {message}
    </p>
  </div>
);
