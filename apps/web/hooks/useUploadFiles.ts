import { trpc } from "@lib/trpc";
import type { UploadType } from "@server/uploads";

type UploadData = {
  type: UploadType;
  file: File;
};

export const useUploadFiles = () => {
  const utils = trpc.useContext();

  const uploadFiles = async (uploads: UploadData[]): Promise<string[]> => {
    const urls = uploads.map(async (upload) => {
      const uploadUrl = await utils.client.uploads.createUploadUrl.mutate({
        type: upload.type,
      });
      const form = new FormData();
      form.append("file", upload.file);
      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: form,
      });
      const uploadedFileUrl = await uploadRes.text();
      return uploadedFileUrl;
    });

    return await Promise.all(urls);
  };

  return uploadFiles;
};
