import StorageFileApi from "@supabase/storage-js/dist/module/packages/StorageFileApi";

export const getDefaultProfile = (address: string) => ({
  address,
  nickname: null,
  description: "",
  avatarUrl: "/default_avatar.gif",
  minShowAmount: "1000000000000000", // 0.001 ETH
});

export const getProfileAvatarUrl = (
  address: string,
  avatarFilename: string | null,
  avatarsBucket: StorageFileApi
) => {
  if (!avatarFilename) {
    return getDefaultProfile(address).avatarUrl;
  }
  return avatarsBucket.getPublicUrl(avatarFilename).data.publicUrl;
};
