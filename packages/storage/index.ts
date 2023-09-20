import { StorageClient as SupabaseStorageClient } from "@supabase/storage-js";
import type StorageFileApi from "@supabase/storage-js/dist/module/packages/StorageFileApi";
import {
  AVATAR_ACCEPTABLE_FILE_TYPES,
  AVATAR_MAX_SIZE,
  NOTIFICATION_IMAGE_ACCEPTABLE_FILE_TYPES,
  NOTIFICATION_IMAGE_MAX_SIZE,
  SOUND_ACCEPTABLE_FILE_TYPES,
  SOUND_MAX_SIZE,
} from "@donum/shared/constants";

// must contain all buckets names
export const BUCKET_NAMES = {
  AVATARS: "avatars",
  NOTIFICATION_IMAGES: "notification-images",
  SOUNDS: "sounds", // TODO: rename to notification-sounds
} as const;
type BucketName = (typeof BUCKET_NAMES)[keyof typeof BUCKET_NAMES];

export const UploadTypes = ["avatar", "notificationImage", "sound"] as const;
export type UploadType = (typeof UploadTypes)[number];

type UploadTypeConfig = {
  allowedMimeTypes: string[];
  maxFileSize: number;
  bucketName: BucketName;
};

export const uploadConfig: Record<UploadType, UploadTypeConfig> = {
  avatar: {
    allowedMimeTypes: AVATAR_ACCEPTABLE_FILE_TYPES,
    maxFileSize: AVATAR_MAX_SIZE,
    bucketName: BUCKET_NAMES.AVATARS,
  },
  notificationImage: {
    allowedMimeTypes: NOTIFICATION_IMAGE_ACCEPTABLE_FILE_TYPES,
    maxFileSize: NOTIFICATION_IMAGE_MAX_SIZE,
    bucketName: BUCKET_NAMES.NOTIFICATION_IMAGES,
  },
  sound: {
    allowedMimeTypes: SOUND_ACCEPTABLE_FILE_TYPES,
    maxFileSize: SOUND_MAX_SIZE,
    bucketName: BUCKET_NAMES.SOUNDS,
  },
};

class ExtendedSupabaseStorageClient extends SupabaseStorageClient {
  private bucketsInitialized = false;

  async createBucketIfAbsent(bucketName: BucketName): Promise<StorageFileApi> {
    // TODO: find a better place to initialize buckets
    // since this will be called every time in case of serveless functions (e.g. vercel)
    if (!this.bucketsInitialized) {
      await this.initBuckets();
    }

    return this.from(bucketName);
  }

  private async initBuckets() {
    const { data: buckets, error } = await this.listBuckets();
    if (error) {
      throw error;
    }

    await Promise.all(
      Object.values(BUCKET_NAMES).map(async (bucketName) => {
        if (!buckets.map((bucket) => bucket.name).includes(bucketName)) {
          const { error } = await this.createBucket(bucketName, {
            public: true,
            // TODO: restrict file types and size
            // allowedMimeTypes: ,
            // fileSizeLimit: ,
          });
          if (error) {
            throw error;
          }
        }
      })
    );

    this.bucketsInitialized = true;
  }
}

export const createStorageClient = (
  supabaseUrl: string,
  serviceKey: string
) => {
  const storageUrl = `${supabaseUrl}/storage/v1`;
  return new ExtendedSupabaseStorageClient(storageUrl, {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  });
};
