import { Socket } from "socket.io-client";

export interface DonationType {
  from: string;
  to: string;
  amount: string;
  message: string;
}

export interface Store {
  socket?: Socket;
  error?: Error;
  donation?: DonationType;
}
