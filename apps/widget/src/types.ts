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
  soundSrc: string;
}

export interface DonationInfoWithMetadata
  extends DonationInfo,
    DonationMetadata {}

export interface WidgetStore {
  socket?: Socket;
  error?: Error;
  duration: number;
  imageSrc: string;
  soundSrc: string;
}
