import { z } from "zod";
import { publicProcedure, router } from "@server/trpc";
import { AVATARS_BUCKET_NAME, buckets } from "@server/storage";
import { AddSchema, EditSchema, NicknameFormat } from "@server/inputSchemas";
import { uploadImage, removeImage, getImageUrl } from "@lib/bucketService";
import { TRPCError } from "@trpc/server";

export const profileRouter = router({
  all: publicProcedure.query(async ({ ctx }) => {
    const avatarsMap = new Map();
    const avatarsBucket = await buckets.from(AVATARS_BUCKET_NAME);
    const { data: avatarFiles, error } = await avatarsBucket.list();
    console.log(avatarFiles);

    if (error) {
      console.error("Error getting avatars list from bucket");
      console.error(error);
    } else {
      avatarFiles.map((avatarFile) => {
        const avatarUrl = getImageUrl(avatarsBucket, avatarFile.name);
        avatarsMap.set(avatarFile.name, avatarUrl);
      });
    }

    const allProfiles = await ctx.prisma.profile.findMany();
    return allProfiles.map((profile) => ({
      wallet: profile.wallet,
      nickname: profile?.nickname,
      bio: profile?.bio,
      avatarUrl: avatarsMap.get(profile.wallet) ?? "",
    }));
  }),
  byNickname: publicProcedure
    .input(z.object({ nickname: NicknameFormat }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { nickname: input.nickname },
      });

      if (!profile) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No such nickname",
        });
      }

      let avatarUrl = "";
      const avatarsBucket = await buckets.from(AVATARS_BUCKET_NAME);
      const { data: avatarFiles, error } = await avatarsBucket.list();
      if (error) {
        console.error("Unable to get items from avatars bucket");
        console.error(error);
      } else {
        const avatarFile = avatarFiles.filter(
          (avatarFile) => avatarFile.name === profile.wallet
        )[0];
        avatarUrl = getImageUrl(avatarsBucket, avatarFile.name);
      }

      return {
        wallet: profile.wallet,
        nickname: profile?.nickname,
        bio: profile?.bio,
        avatarUrl: avatarUrl,
      };
    }),
  add: publicProcedure.input(AddSchema).mutation(async ({ ctx, input }) => {
    let profile = await ctx.prisma.profile.findFirst({
      where: { wallet: input.wallet },
    });
    if (profile) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Account with this wallet is already added",
      });
    }

    let avatarPublicUrl = "";
    if (input.avatar) {
      avatarPublicUrl = await uploadImage(
        await ctx.buckets.from(AVATARS_BUCKET_NAME),
        input.avatar,
        input.wallet
      );
    }

    profile = await ctx.prisma.profile.create({
      data: { wallet: input.wallet, nickname: input.nickname, bio: input.bio },
    });

    return {
      wallet: profile.wallet,
      nickname: profile?.nickname,
      bio: profile?.bio,
      avatarUrl: avatarPublicUrl,
    };
  }),
  edit: publicProcedure.input(EditSchema).mutation(async ({ ctx, input }) => {
    let profile = await ctx.prisma.profile.findFirst({
      where: { wallet: input.wallet },
    });

    if (!profile) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No account connected with this wallet, create account first",
      });
    }

    if (input.nickname) {
      const sameNicknameCheck = await ctx.prisma.profile.findFirst({
        where: { nickname: input.nickname },
      });
      if (sameNicknameCheck) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This nickname is already used",
        });
      }

      profile.nickname = input.nickname;
    }

    if (input.bio) {
      profile.bio = input.bio;
    }
    profile = await ctx.prisma.profile.update({
      where: { wallet: input.wallet },
      data: { nickname: profile.nickname, bio: profile.bio },
    });

    let avatarPublicUrl = "";
    if (input.avatar) {
      const avatarsBucket = await ctx.buckets.from(AVATARS_BUCKET_NAME);
      await removeImage(avatarsBucket, input.wallet);
      avatarPublicUrl = await uploadImage(
        avatarsBucket,
        input.avatar,
        input.wallet
      );
      console.log(avatarPublicUrl);
    }

    return {
      wallet: profile.wallet,
      nickname: profile?.nickname,
      bio: profile?.bio,
      avatarUrl: avatarPublicUrl,
    };
  }),
});
