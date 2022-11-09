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
    <div className="flex h-full w-full flex-col items-center">
      {audio}
      <ResponsiveImage src={src} alt="donation alert image" />
      <h1 className="text-border-2 pt-2.5 text-center text-3xl font-bold text-yellow-500">
        {sender} sent {ethers.utils.formatEther(amount)} ETH
      </h1>
      <p className="text-border-1 pt-2.5 text-center text-xl leading-none text-zinc-50">
        {message}
      </p>
    </div>
  );
};
