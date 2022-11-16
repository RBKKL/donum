import { publicProcedure, router } from "@server/trpc";
import { AVATARS_BUCKET_NAME, buckets } from "@server/storage";
import { AddSchema } from "@server/inputSchemas";
import { uploadImage } from "@lib/bucketService";
import { TRPCError } from "@trpc/server";
import { uuid4 } from "@sentry/utils";
import { profileRouter } from "@server/routers/profile";

// This router contains development only endpoints
// They may work wrong or not work at all
export const devOnlyProfileRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const avatarsMap = new Map();
    const avatarsBucket = await buckets.from(AVATARS_BUCKET_NAME);
    const { data: avatarFiles, error } = await avatarsBucket.list();

    // data === null only when error !== null and vice versa
    if (avatarFiles) {
      avatarFiles.map((avatarFile) => {
        const avatarUrl = avatarsBucket.getPublicUrl(avatarFile.name).data
          .publicUrl;
        avatarsMap.set(avatarFile.name, avatarUrl);
      });
    } else {
      console.error("Error getting avatars list from bucket");
      console.error(error);
    }

    const allProfiles = await ctx.prisma.profile.findMany();
    return allProfiles.map((profile) => ({
      address: profile.address,
      nickname: profile?.nickname,
      description: profile?.description,
      avatarUrl: avatarsMap.get(profile.avatarFilename) ?? "",
      minShowAmount: profile.minShowAmount.toString(),
    }));
  }),
  byNickname: profileRouter.byNickname,
  byAddress: profileRouter.byAddress,
  add: publicProcedure.input(AddSchema).mutation(async ({ ctx, input }) => {
    let profile = await ctx.prisma.profile.findFirst({
      where: { address: input.address },
    });
    if (profile) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Account with this wallet is already added",
      });
    }

    let avatarPublicUrl = "";
    let avatarFilename = null;
    if (input.avatar) {
      avatarFilename = uuid4();
      avatarPublicUrl = await uploadImage(
        await ctx.buckets.from(AVATARS_BUCKET_NAME),
        input.avatar,
        avatarFilename
      );
    }

    profile = await ctx.prisma.profile.create({
      data: {
        address: input.address,
        nickname: input.nickname,
        description: input.description,
        avatarFilename: avatarFilename,
      },
    });

    return {
      address: profile.address,
      nickname: profile?.nickname,
      description: profile?.description,
      avatarUrl: avatarPublicUrl,
      minShowAmount: profile.minShowAmount.toString(),
    };
  }),
  edit: profileRouter.edit,
});
