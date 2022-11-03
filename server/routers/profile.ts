import { z } from "zod";
import { publicProcedure, router } from "@server/trpc";
import { AVATARS_BUCKET_NAME, buckets } from "@server/storage";
import { getFilenameWithoutExtension, mergeProfileAndAvatar } from "@lib/helpers";
import { AddSchema, EditSchema, NicknameSchema } from "@server/inputSchemas";
import { uploadImage } from "@lib/bucketService";

export const profileRouter = router({
  all: publicProcedure.query( async ({ctx}) => {
    const avatarsMap = new Map();
    const avatarsBucket = await buckets.from(AVATARS_BUCKET_NAME);
    const { data: avatarFiles, error } = await avatarsBucket.list();

    if (error) {
      console.error("Error getting avatars list from bucket");
      console.error(error);
    }
    else {
      avatarFiles.map(avatarFile => {
        const avatarFilenameWithoutExtension = getFilenameWithoutExtension(avatarFile.name);
        const dataPublicUrl = avatarsBucket.getPublicUrl(avatarFile.name);
        const avatarUrl = dataPublicUrl.data.publicUrl;
        avatarsMap.set(avatarFilenameWithoutExtension, avatarUrl);
      });
    }

    const allProfiles =  await ctx.prisma.profile.findMany();
    return allProfiles.map(profile => ({
      wallet: profile.wallet,
      nickname: profile.nickname,
      bio: profile.bio,
      avatarUrl: avatarsMap.get(profile.wallet) ?? "",
    }));
  }),
  byNickname: publicProcedure
    .input(z.object({ nickname: NicknameSchema }))
    .query(async ({ctx, input}) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { nickname: input.nickname },
      });

      let avatarUrl = "";
      const avatarsBucket = await buckets.from(AVATARS_BUCKET_NAME);
      const { data: avatarFiles, error } = await avatarsBucket.list();
      if (error) {
        console.error("Unable to get items from avatars bucket");
        console.error(error);
      }
      else if (profile?.wallet) {
        const avatarName = avatarFiles
          .map(avatarFile => avatarFile.name)
          .filter(filename => filename.includes(profile.wallet))[0];
        const dataPublicUrl = avatarsBucket.getPublicUrl(avatarName);
        avatarUrl = dataPublicUrl.data.publicUrl;
      }

      return {
        wallet: profile?.wallet,
        nickname: profile?.nickname,
        bio: profile?.bio,
        avatarUrl: avatarUrl
      };
    }),
  add: publicProcedure
    .input(AddSchema)
    .mutation(async ({ ctx, input }) => {
      let avatarPublicUrl = "";
      if (input.avatar) {
        avatarPublicUrl = await uploadImage(input.avatar, input.wallet);
      }
      const profile = await ctx.prisma.profile.create({
        data: { nickname: input.nickname, bio: input.bio, wallet: input.wallet },
      });

      return {
        wallet: profile.wallet,
        nickname: profile?.nickname,
        bio: profile?.bio,
        avatarUrl: avatarPublicUrl,
      };
    }),
  edit: publicProcedure
    .input(EditSchema)
    .mutation(async ({ ctx, input }) => {
      let avatarPublicUrl = "";
      if (input.avatar) {
        avatarPublicUrl = await uploadImage(input.avatar, input.wallet);
      }
      let profile = await ctx.prisma.profile.findFirst({
        where: { wallet: input.wallet },
      });

      if (profile) {
        if (input.bio) {
          profile.bio = input.bio;
        }
        if (input.nickname) {
          profile.nickname = input.nickname;
        }

        profile = await ctx.prisma.profile.update({
          where: { wallet: input.wallet },
          data: { nickname: profile.nickname, bio: profile.bio },
        });
      }

      // return mergeProfileAndAvatar(profile, avatarPublicUrl);

      return {
        wallet: profile?.wallet,
        nickname: profile?.nickname,
        bio: profile?.bio,
        avatarUrl: avatarPublicUrl,
      };
    }),
});
