import {
  AVATAR_ACCEPTABLE_FILE_TYPES,
  AVATAR_MAX_SIZE,
} from "@donum/shared/constants";
import { AVATARS_BUCKET_NAME } from "@server/storage";
import { Options } from "formidable";
import Keyv from "keyv";
import { v4 as uuidv4 } from "uuid";

type StoredUploadConfig = {
  mimetypes: string[];
  maxsize: number;
  bucket: string;
};

const files = new Keyv<StoredUploadConfig>("redis://localhost:6379", {
  ttl: 1000 * 60, // 1 minute
  namespace: "files",
});

const BASE_URL = "http://localhost:3000";

export const generateUploadAvatarUrl = async () => {
  const id = uuidv4();
  await files.set(id, {
    mimetypes: AVATAR_ACCEPTABLE_FILE_TYPES,
    maxsize: AVATAR_MAX_SIZE,
    bucket: AVATARS_BUCKET_NAME,
  });
  return `${BASE_URL}/api/files/upload?id=${id}`;
};

export const getUploadConfig = async (
  id: string
): Promise<{ options: Options; bucket: string }> => {
  const config = await files.get(id);
  if (!config) {
    throw new Error("Invalid id");
  }

  return {
    bucket: config.bucket,
    options: {
      keepExtensions: true,
      allowEmptyFiles: false,
      maxFiles: 1,
      maxFields: 1,
      maxFileSize: config.maxsize,
      maxFieldsSize: config.maxsize,
      filename: (_, ext) => `${uuidv4()}${ext}`,
      filter: (part) => {
        const { mimetype } = part;
        if (!mimetype) {
          return false;
        }
        return config.mimetypes.includes(mimetype);
      },
    },
  };
};
