import { Socket } from "socket.io-client";

export interface DonationInfo {
  from: string;
  nickname: string;
  amount: string;
  message: string;
}

export interface WidgetStore {
  socket?: Socket;
  error?: Error;
  donationInfo?: DonationInfo;
  duration: number;
  imageSrc: string;
  soundSrc: string;
}
