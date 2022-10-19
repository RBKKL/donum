import { FC } from "react";
import { ResponsiveImage } from "@components/ResponsiveImage";
import { BigNumber, ethers } from "ethers";
import { useAudio } from "react-use";

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
}) => {
  const [audio] = useAudio({
    src: "http://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3",
    autoPlay: true,
  });

  return (
    <div className="w-full h-full flex flex-col items-center">
      {audio}
      <ResponsiveImage src={src} alt="donation alert image" />
      <h1 className="text-center pt-2.5 text-yellow-500 text-3xl font-bold text-border-2">
        {sender} sent {ethers.utils.formatEther(amount)} ETH
      </h1>
      <p className="text-center pt-2.5 text-zinc-50 text-border-1 leading-none text-xl">
        {message}
      </p>
    </div>
  );
};
