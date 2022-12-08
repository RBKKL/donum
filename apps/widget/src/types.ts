import { Socket } from "socket.io-client";

export interface DonationInfo {
  from: string;
  nickname: string;
  amount: string;
  message: string;
}

export interface DonationMetadata {
  duration: number;
  imageSrc: string;
  imageType: "image" | "video";
  soundSrc: string;
}

export interface DonationInfoWithMetadata
  extends DonationInfo,
    DonationMetadata {}

export interface WidgetStore extends DonationMetadata {
  socket?: Socket;
  error?: Error;
}
