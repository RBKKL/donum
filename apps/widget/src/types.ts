import { Socket } from "socket.io-client";

export interface DonationInfo {
  from: string;
  amount: string;
  message: string;
}

export interface WidgetStore {
  socket?: Socket;
  error?: Error;
  donationInfo?: DonationInfo;
  imageSrc: string;
  soundSrc: string;
}
