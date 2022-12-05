import { Prisma } from "@donum/prisma";

export type Profile = {
  address: string;
  nickname?: string | null;
  description?: string;
  avatarUrl?: string | null;
  minShowAmount?: Prisma.Decimal;
  notificationDuration?: number;
  notificationImageUrl?: string | null;
  notificationSoundUrl?: string | null;
};

export type PopulatedProfile = {
  address: string;
  nickname: string;
  description: string;
  avatarUrl: string;
  minShowAmount: string;
  notificationDuration: number;
  notificationImageUrl: string;
  notificationSoundUrl: string;
};

export const populateProfileWithDefaultValues = (
  profile: Profile
): PopulatedProfile => ({
  address: profile.address,
  nickname: profile.nickname ?? "",
  description: profile.description ?? "",
  avatarUrl: profile.avatarUrl ?? "/default_avatar.gif",
  minShowAmount: profile.minShowAmount?.toString() ?? "1000000000000000", // default is 0.001 ETH
  notificationDuration: profile.notificationDuration ?? 5,
  notificationImageUrl: profile.notificationImageUrl ?? "",
  notificationSoundUrl: profile.notificationSoundUrl ?? "",
});
