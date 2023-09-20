import type {
  RemoveUndefinedOrNull,
  PartialExcept,
} from "@donum/shared/type-utils";
import { type Profile as ProfileDb } from "@donum/prisma";
import { parseEther } from "viem";

export { ProfileDb };
export type Profile = PartialExcept<Omit<ProfileDb, "id">, "address">;
export type PopulatedProfile = RemoveUndefinedOrNull<Profile>;

export const populateProfileWithDefaultValues = (
  profile: Profile
): PopulatedProfile => {
  return {
    address: profile.address,
    nickname: profile.nickname ?? "",
    avatarUrl: profile.avatarUrl || "/default_avatar.gif",
    description: profile.description ?? "",
    minShowAmount: profile.minShowAmount ?? parseEther("0.001"), // in wei
    notificationDuration: profile.notificationDuration ?? 5, // in seconds
    notificationImageUrl: profile.notificationImageUrl || "",
    notificationSoundUrl: profile.notificationSoundUrl || "",
  };
};
