import { Socket } from "socket.io-client";

export interface DonationInfo {
  from: string;
  amount: string;
  message: string;
  // type of donation defines it's metadata (soundSrc, imageSrc etc)
  type: string;
}

export interface DonationMetadata {
  duration: number;
  imageSrc: string;
  soundSrc: string;
}

export interface WidgetStore {
  socket?: Socket;
  error?: Error;
  donations: Array<DonationInfo>;
  isShowingDonation: boolean;
  // when true indicating that prev donation is already shown, but it's too early to show next donation
  isBetweenDonations: boolean;
}
