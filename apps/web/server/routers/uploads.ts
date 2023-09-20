import { z } from "zod";
import { createRouter, protectedProcedure } from "@server/trpc";
import { UploadTypes, uploadConfig } from "@lib/storage";
import { v4 as uuidv4 } from "uuid";

export const uploadsRouter = createRouter({
  createUploadUrl: protectedProcedure
    .input(z.object({ type: z.enum(UploadTypes) }))
    .mutation(async ({ ctx, input }) => {
      const bucketName = uploadConfig[input.type].bucketName;
      const bucket = await ctx.storage.createBucketIfAbsent(bucketName);
      const { data, error } = await bucket.createSignedUploadUrl(uuidv4()); // TODO: change naming convention so we can delete previous uploads
      if (error) {
        throw error; // TODO: handle error
      }

      return { bucket: bucketName, path: data.path, token: data.token };
    }),
});
