import { Socket } from "socket.io-client";
import {AnyStateMachine} from "xstate";

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
}
