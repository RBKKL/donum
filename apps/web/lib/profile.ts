import { type RemoveUndefinedOrNull } from "@donum/shared/helpers";

export type Profile = {
  address: string;
  nickname?: string | null;
  description?: string;
  avatarUrl?: string | null;
  minShowAmount?: bigint;
  notificationDuration?: number;
  notificationImageUrl?: string | null;
  notificationSoundUrl?: string | null;
};

export type PopulatedProfile = RemoveUndefinedOrNull<Profile>;

export const populateProfileWithDefaultValues = (
  profile: Profile
): PopulatedProfile => ({
  address: profile.address,
  nickname: profile.nickname ?? "",
  description: profile.description ?? "",
  avatarUrl: profile.avatarUrl ?? "/default_avatar.gif",
  minShowAmount: profile.minShowAmount ?? 1000000000000000n, // default is 0.001 ETH
  notificationDuration: profile.notificationDuration ?? 5,
  notificationImageUrl: profile.notificationImageUrl ?? "",
  notificationSoundUrl: profile.notificationSoundUrl ?? "",
});
