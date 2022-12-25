import {
  AVATAR_ACCEPTABLE_FILE_TYPES,
  AVATAR_MAX_SIZE,
  NOTIFICATION_IMAGE_ACCEPTABLE_FILE_TYPES,
  NOTIFICATION_IMAGE_MAX_SIZE,
  SOUND_ACCEPTABLE_FILE_TYPES,
  SOUND_MAX_SIZE,
} from "@donum/shared/constants";
import { serverEnv } from "@env/server";
import {
  AVATARS_BUCKET_NAME,
  NOTIFICATION_IMAGES_BUCKET_NAME,
  SOUNDS_BUCKET_NAME,
} from "@server/storage";
import { Options } from "formidable";
import Keyv from "keyv";
import { v4 as uuidv4 } from "uuid";

export const UploadTypes = ["avatar", "notificationImage", "sound"] as const;
export type UploadType = typeof UploadTypes[number];

type UploadConfig = {
  allowedMimeTypes: string[];
  maxFileSize: number;
  bucketName: string;
};

export const uploadsStore = new Keyv<UploadType>(serverEnv.DATABASE_URL, {
  ttl: 1000 * 60, // 1 minute
  namespace: "uploads",
});

export const uploadConfig: Record<UploadType, UploadConfig> = {
  avatar: {
    allowedMimeTypes: AVATAR_ACCEPTABLE_FILE_TYPES,
    maxFileSize: AVATAR_MAX_SIZE,
    bucketName: AVATARS_BUCKET_NAME,
  },
  notificationImage: {
    allowedMimeTypes: NOTIFICATION_IMAGE_ACCEPTABLE_FILE_TYPES,
    maxFileSize: NOTIFICATION_IMAGE_MAX_SIZE,
    bucketName: NOTIFICATION_IMAGES_BUCKET_NAME,
  },
  sound: {
    allowedMimeTypes: SOUND_ACCEPTABLE_FILE_TYPES,
    maxFileSize: SOUND_MAX_SIZE,
    bucketName: SOUNDS_BUCKET_NAME,
  },
};

export const getUploadConfig = async (
  id: string
): Promise<{
  options: Options;
  bucket: string;
}> => {
  const uploadType = await uploadsStore.get(id);
  if (!uploadType) {
    throw new Error("Invalid id");
  }

  return {
    bucket: uploadConfig[uploadType].bucketName,
    options: {
      keepExtensions: true,
      allowEmptyFiles: false,
      maxFiles: 1,
      maxFields: 1,
      maxFileSize: uploadConfig[uploadType].maxFileSize,
      maxFieldsSize: uploadConfig[uploadType].maxFileSize,
      filename: (_, ext) => `${uuidv4()}${ext}`,
      filter: (part) => {
        const { mimetype } = part;
        if (!mimetype) {
          return false;
        }
        return uploadConfig[uploadType].allowedMimeTypes.includes(mimetype);
      },
    },
  };
};
