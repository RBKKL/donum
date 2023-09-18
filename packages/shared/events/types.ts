type AdressableEvent<T> = {
  to: string;
  data: T;
};

export interface ChangeSettingsEventData {
  notificationImageUrl?: string | null;
  notificationSoundUrl?: string | null;
  notificationDuration?: number | null;
}

export type ChangeSettingsEvent = AdressableEvent<ChangeSettingsEventData>;

export interface NewDonationEventData {
  from: string; // address
  nickname: string;
  message: string;
  amount: string; // amount in wei as string, because socket.io can't serialize BigInt
}

export type NewDonationEvent = AdressableEvent<NewDonationEventData>;

// TODO:  refactor this to unify with ChangeSettingsEventData
export interface DonationMetadata {
  duration: number;
  imageSrc: string;
  imageType: "image" | "video";
  soundSrc: string;
}

export interface NewDonationWithMetadata
  extends NewDonationEventData,
    DonationMetadata {}

export interface ServerToClientEvents {
  newDonation: (data: NewDonationEventData) => void;
  changeSettings: (data: ChangeSettingsEventData) => void;
}

export interface ClientToServerEvents {}
