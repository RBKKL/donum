import { Socket } from "socket.io-client";

export interface EventInfo {
  from: string;
  nickname: string;
  amount: string;
  message: string;
}

export interface EventMetadata {
  duration: number;
  imageSrc: string;
  imageType: "image" | "video";
  soundSrc: string;
}

export type DonationInfo = EventInfo;

export interface ChallengeInfo extends EventInfo {
  award: string;
  status: string;
}

export type DonationMetadata = EventMetadata;

export type ChallengeMetadata = EventMetadata;

export interface DonationInfoWithMetadata
  extends DonationInfo,
    DonationMetadata {}

export interface ChallengeInfoWithMetadata
  extends ChallengeInfo,
    ChallengeMetadata {}

export interface EventInfoWithMetadata extends EventInfo, EventMetadata {}

export interface WidgetStore extends EventMetadata {
  socket?: Socket;
  error?: Error;
}
