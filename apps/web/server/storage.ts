import { StorageClient } from "@supabase/storage-js";
import { serverEnv } from "@env/server";

export const AVATARS_BUCKET_NAME = "avatars";
const BUCKET_NAMES = [AVATARS_BUCKET_NAME]; // must contain all buckets names

class BucketsStorage {
  private storageClient: StorageClient;
  private bucketsInitialized = false;
  private bucketNames: Array<string>;

  public constructor(
    storageUrl: string,
    serviceKey: string,
    bucketNames: Array<string>
  ) {
    this.bucketNames = bucketNames;

    this.storageClient = new StorageClient(storageUrl, {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    });
  }

  private async initBuckets() {
    const { data: buckets, error: listBucketsError } =
      await this.storageClient.listBuckets();
    if (listBucketsError) {
      console.error("Unable to get list of buckets, error:");
      console.error(listBucketsError);
    }

    await Promise.all(
      this.bucketNames.map(async (bucketName) => {
        if (!buckets?.map((bucket) => bucket.name).includes(bucketName)) {
          const { error } = await this.storageClient.createBucket(
            bucketName, // Bucket name (must be unique)
            { public: true } // Bucket options
          );
          if (error) {
            console.error(`Error creating ${bucketName} bucket`);
            console.error(error);
          }
        }
      })
    );
  }

  public async from(id: string) {
    if (this.bucketsInitialized) {
      return this.storageClient.from(id);
    }

    await this.initBuckets();
    this.bucketsInitialized = true;

    return this.storageClient.from(id);
  }
}

export const buckets = new BucketsStorage(
  serverEnv.STORAGE_URL,
  serverEnv.SERVICE_KEY,
  BUCKET_NAMES
);