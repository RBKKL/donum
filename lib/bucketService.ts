import { base64ToBlob } from "@lib/helpers";
import { AVATARS_BUCKET_NAME } from "@server/storage";
import StorageFileApi from "@supabase/storage-js/src/packages/StorageFileApi";

export const uploadImage = async (bucket: StorageFileApi, avatarBase64: string, wallet: string) => {
  const blobAvatar = await base64ToBlob(avatarBase64);
  const stringAvatar = await blobAvatar.text();
  const avatarFilenameInBucket = `${wallet}.${blobAvatar.type.substring(6)}`;
  const avatarsBucket = await buckets.from(AVATARS_BUCKET_NAME);
  const { error: uploadError } = await bucket
    .upload(avatarFilenameInBucket, stringAvatar, {upsert: true});

  if (uploadError) {
    console.error(`Error loading new avatar in bucket for ${wallet}`);
    console.error(uploadError);
  }

  const { data: { publicUrl: avatarPublicUrl } } = avatarsBucket.getPublicUrl(avatarFilenameInBucket);
  return avatarPublicUrl;
}