import { z } from "zod";
import { router, protectedProcedure } from "@server/trpc";
import { UploadTypes } from "@server/uploads";
import { serverEnv } from "@env/server";
import { v4 as uuidv4 } from "uuid";

export const uploadsRouter = router({
  createUploadUrl: protectedProcedure
    .input(z.object({ type: z.enum(UploadTypes) }))
    .mutation(async ({ ctx, input }) => {
      const id = uuidv4();
      await ctx.uploadsStore.set(id, input.type); // store the upload type for generated id in redis
      return `${serverEnv.WEBAPP_BASE_URL}/api/files/upload?id=${id}`;
    }),
});