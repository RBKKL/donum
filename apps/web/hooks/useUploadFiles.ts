import { trpc } from "@lib/trpc";
import { type UploadType } from "@lib/storage";
import { browserStorageClient } from "@lib/storage/browser";

type UploadData = {
  type: UploadType;
  file: File;
};

export const useUploadFiles = () => {
  const utils = trpc.useContext();

  const uploadFiles = async (uploads: UploadData[]): Promise<string[]> => {
    const urls = uploads.map(async (upload) => {
      const data = await utils.client.uploads.createUploadUrl.mutate({
        type: upload.type,
      });

      const bucket = browserStorageClient.from(data.bucket);
      const uploadRes = await bucket.uploadToSignedUrl(
        data.path,
        data.token,
        upload.file
      );

      if (uploadRes.error) {
        throw uploadRes.error; // TODO: handle error?
      }

      const {
        data: { publicUrl },
      } = bucket.getPublicUrl(uploadRes.data!.path);
      return publicUrl; // TODO: can it be vulnerability to send url instead of path to server?
    });

    return await Promise.all(urls);
  };

  return uploadFiles;
};
