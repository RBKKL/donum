import { base64ToBlob } from "@lib/helpers";
import StorageFileApi from "@supabase/storage-js/dist/module/packages/StorageFileApi";

export const uploadImage = async (
  bucket: StorageFileApi,
  imageBase64: string,
  filename: string
) => {
  const blobImage = await base64ToBlob(imageBase64);
  const { error: uploadError } = await bucket.upload(filename, blobImage, {
    upsert: true,
  });

  if (uploadError) {
    console.error(`Error uploading image in bucket for ${filename}`);
    console.error(uploadError);
  }

  return bucket.getPublicUrl(filename).data.publicUrl;
};

export const removeImage = async (bucket: StorageFileApi, filename: string) => {
  const { error: removeError } = await bucket.remove([filename]);
  if (removeError) {
    console.error(`Error removing image from bucket for ${filename}`);
    console.error(removeError);
  }
};